
export interface IFileInfoDTO {
    fileName?: string;
    fileType?: string;
    preSignedUrl?: string;
    uploaded?: boolean;
}

export class FileInfoDTO implements IFileInfoDTO {
    constructor(
        public fileName?: string,
        public fileType?: string,
        public preSignedUrl?: string,
        public uploaded?: boolean
    ) {
    }
}