
export interface ICandidateBulkUploadBatch {
    id?: string;
    batchCode?: string;
    totalSelected?: number;
    totalUploaded?: number;
}

export class CandidateBulkUploadBatch implements ICandidateBulkUploadBatch {
    constructor(
        public id?: string,
        public batchCode?: string,
        public totalSelected?: number,
        public totalUploaded?: number,
    ) {
    }
}
