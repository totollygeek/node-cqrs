import { Participant } from './Participant';

export class Petition {
    public participants: Participant[] = [];
    public state: State;

    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly startDateTime: Date,
    ) {}
}

export enum State {
    Created = 'created',
    Closed = 'closed',
}
