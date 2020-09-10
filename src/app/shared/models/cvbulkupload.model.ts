
import { ICVUploadDTO } from './cvupload.model';

export interface ICVBulkUploadDTO {
    bulkUploadList?: ICVUploadDTO[];
}

export class CVBulkUploadDTO implements ICVBulkUploadDTO {
    constructor(
        public bulkUploadList?: ICVUploadDTO[]
    ) {
    }
}