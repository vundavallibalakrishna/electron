
import { ITeam } from './team.model';

export interface ICVUploadDTO {
    resumeURL?: string;
    resumeFileName?: string;
    skills?: string[];
    tags?: string[];
    locations?: string[];
    team?: ITeam;
    importFrom?: string;
    batchId?: string;
    batchCode?: string;
}

export class CVUploadDTO implements ICVUploadDTO {
    constructor(
        public resumeURL?: string,
        public resumeFileName?: string,
        public skills?: string[],
        public tags?: string[],
        public locations?: string[],
        public team?: ITeam,
        public importFrom?: string,
        public batchId?: string,
        public batchCode?: string,
    ) {
    }
}