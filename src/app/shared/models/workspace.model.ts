
export interface IWorkspace {
    id?: string;
    name?: string;
    link?: string;
}

export class Workspace implements IWorkspace {
    constructor(
        public id?: string,
        public name?: string,
        public link?: string,
    ) {
    }
}