
export interface ITeam {
    id?: string;
    name?: string;
    ownerEmail?: string;
}

export class Team implements ITeam {
    constructor(
        public id?: string,
        public name?: string,
        public ownerEmail?: string,
    ) {
    }
}