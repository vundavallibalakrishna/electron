import { Component, OnInit } from '@angular/core';
const { ipcRenderer } = require('electron');
const fs = require('fs');
const glob = require("glob");
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, startWith, debounceTime, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { IFileInfoDTO, FileInfoDTO } from 'app/shared/models/fileinfo.model';
import { IBulkFileUploadDTO } from 'app/shared/models/bulkfileinfo.model';
import { ICandidateBulkUploadBatch } from 'app/shared/models/batch.model';
import { CVBulkUploadDTO } from 'app/shared/models/cvbulkupload.model';
import { CVUploadDTO, ICVUploadDTO } from 'app/shared/models/cvupload.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ITeam } from 'app/shared/models/team.model';
import { FormControl } from '@angular/forms';
import { identifierModuleUrl } from '@angular/compiler';
import { MatSlideToggle } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-home',
  templateUrl: './bulk-upload-cv-parser.html',
  styleUrls: ['./bulk-upload-cv-parser.scss']
})
export class BulkUploadCVComponent implements OnInit {

  flowFiles: [];
  currentLocations: [];
  flow: null;
  uploadErrorCount = 0;
  processErrorCount = 0;
  total = 0;
  totalCount = 0;
  uploaded = 0;
  invalidTotal = 0;
  pageTitle = "Bulk Upload Candidate Profiles";
  allowedExtension: string[] = [".doc", ".docx", ".pdf", ".odt", ".html", ".rtf", ".txt"];
  showSuccess: boolean;
  reset: boolean;
  uploadCompleted = true;
  selectedDirectory = "";
  filterBy: "all";
  workAssignment: any = {};
  isSaving = false;
  contentTypes: any = {
    "doc": "application/msword",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "pdf": "application/pdf",
    "txt": "text/plain",
    "odt": "application/vnd.oasis.opendocument.text",
    "rtf": "application/rtf",
    "xhtml": "application/xhtml+xml",
    "html": "text/html",
  };
  address: Address = null;
  skills: string[] = [];
  tags = [];
  team: ITeam = null;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  teamAutoComplete$: Observable<ITeam> = null;
  autoCompleteControl = new FormControl();
  progress = 0;
  pattern = "";
  ignoreDuplicates = true;
  processNestedFolders = true;

  constructor(private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.teamAutoComplete$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        if (value !== '') {
          return this.suggestTeams(value);
        } else {
          return of(null);
        }
      })
    );
  }

  selectFiles(): void {
    this.invalidTotal = 0;
  }

  openDialog(): void {
    this.selectedDirectory = ipcRenderer.sendSync('select-dirs')[0];
    this.listFiles();
  }

  private listFiles(): void {
    this.pattern = this.processNestedFolders ? "/**/*+(*" + this.allowedExtension.join("|*") + ")" : "/*+(*" + this.allowedExtension.join("|*") + ")";
    const uploadFileList: string[] = glob.sync(`${this.selectedDirectory}${this.pattern}`);
    this.total = uploadFileList.length;
  }

  async startUpload(): Promise<number> {
    if (this.selectedDirectory) {
      this.progress = 1;
      const batchResponse = await this.generateBatchId(this.total).toPromise();
      const batch = batchResponse.body;
      this.isSaving = true;
      const uploadFileList: string[] = glob.sync(`${this.selectedDirectory}${this.pattern}`);
      const batches: string[][] = this.splitIntoBatches(uploadFileList);
      for (let i = 0; i < batches.length; i++) {
        const httpResponse: HttpResponse<IBulkFileUploadDTO> = await this.generateS3URLS(batches[i]).toPromise();
        const bulkFileUploadDTO = httpResponse.body;
        await Promise.all(bulkFileUploadDTO
          .bulkFileList
          .map((fileInfoDTO: IFileInfoDTO) => this.pushFileToS3(fileInfoDTO, this.selectedDirectory).toPromise()));
        await this.sendResumesToCVParser(
          bulkFileUploadDTO
            .bulkFileList
            .filter((fileInfoDTO) => fileInfoDTO.uploaded)
            .map((fileInfoDTO: IFileInfoDTO) => new CVUploadDTO(fileInfoDTO.preSignedUrl, fileInfoDTO.fileName, this.skills, this.tags, this.currentLocations, this.team, "local", batch.id, batch.batchCode))
        ).toPromise();
      }
    }
    return Promise.resolve(1);
  }

  splitIntoBatches(uploadFileList: string[]): string[][] {
    const chunk = 100, splits = [];
    let index = -1;
    uploadFileList.forEach((n, i) => { if (i % chunk == 0) { splits[++index] = [] } splits[index].push(n) });
    return splits;
  }


  generateS3URLS(files: string[]): Observable<HttpResponse<IBulkFileUploadDTO>> {
    const bulkFileList = files.map((fileName) => {
      return { fileName: fileName, fileType: this.contentTypes[fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase()] };
    });
    return this
      .http
      .post<IBulkFileUploadDTO>('api/s3/bulk-presigned-url-for-put', {
        bulkFileList: bulkFileList
      }, { observe: 'response' });
  }

  pushFileToS3(fileInfo: IFileInfoDTO, dir: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(dir + fileInfo.fileName));
    return this
      .http
      .put<any>(fileInfo.preSignedUrl, formData, {
        headers: {
          'Content-Type': fileInfo.fileType,
        },
      })
      .pipe(catchError((error) => this.erroHandler(error)))
      .pipe(map((res: any) => this.successHandler(fileInfo, res)));
  }

  sendResumesToCVParser(cvuploadDTO: ICVUploadDTO[]): Observable<HttpResponse<any>> {
    const entity = new CVBulkUploadDTO(cvuploadDTO);
    return this
      .http
      .post<any>('candidatesearch/api/job-candidate-interactions/send-resume-to-cv-parser', entity);
  }

  generateBatchId(count: number): Observable<HttpResponse<ICandidateBulkUploadBatch>> {
    return this
      .http
      .get<any>(`candidatesearch/api/candidate/bulkupload/generatebatch/${count}/local`, { observe: 'response' });
  }

  handleAddressChange(address: Address): void {
    this.address = address;
  }

  erroHandler(error: HttpErrorResponse): any {
    this.processErrorCount = this.processErrorCount + 1;
    return throwError(error.message || 'server Error');
  }

  successHandler(fileInfo: IFileInfoDTO, input: HttpResponse<any>): any {
    fileInfo.uploaded = true;
    this.uploaded = this.uploaded + 1;
    this.progress = (this.uploaded / this.total) * 100;
    return input;
  }

  getTotalFiles(): number {
    return this.total;
  }

  getInvalidTotalFiles(): number {
    return this.invalidTotal;
  }


  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.skills.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  suggestTeams(query: string): Observable<ITeam> {
    return this.http
      .get<ITeam>('recruitersearch/api/teams/suggestions/all', {
        observe: 'response',
        params: {
          query: query
        }
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }

  selectTeam(team: ITeam): void {
    console.log(team);
    this.team = team;
  }

  setOptionValue(type: string, event): void {
    if (type == 'ID') {
      this.processNestedFolders = event.checked;
    } else if (type == 'PNF') {
      this.processNestedFolders = event.checked;
      this.listFiles();
    }
  }

}


