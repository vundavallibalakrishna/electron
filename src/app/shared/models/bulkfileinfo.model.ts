
import { IFileInfoDTO } from './fileinfo.model';

export interface IBulkFileUploadDTO {
    bulkFileList?: IFileInfoDTO[];
}

export class BulkFileUploadDTO implements IBulkFileUploadDTO {
    constructor(
        public bulkFileList?: IFileInfoDTO[]
    ) {
    }
}