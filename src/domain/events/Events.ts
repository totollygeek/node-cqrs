import { IEvent } from '@nestjs/cqrs';

export interface IEventBase extends IEvent {
    id: string;
    revision: number;
    type: EventType;
}

export enum EventType {
    PetitionStarted = 'petition-started',
    PetitionClosed = 'petition-closed',
    SignerAdded = 'signer-added',
    SignerRemoved = 'signer-removed',
}

export class PetitionCreated implements IEventBase {
    public readonly type: EventType = EventType.PetitionStarted;
    constructor(
        public readonly id: string,
        public readonly revision: number,
        public readonly title: string,
        public readonly startTimestamp: Date,
    ) {}
}

export class PetitionClosed implements IEventBase {
    public readonly type: EventType = EventType.PetitionClosed;
    constructor(
        public readonly id: string,
        public readonly revision: number,
        public readonly endTimestamp: Date,
    ) {}
}

export class SignerAdded implements IEventBase {
    public readonly type: EventType = EventType.SignerAdded;
    constructor(
        public readonly id: string,
        public readonly revision: number,
        public readonly email: string,
        public readonly name: string,
    ) {}
}

export class SignerRemoved implements IEventBase {
    public readonly type: EventType = EventType.SignerRemoved;
    constructor(
        public readonly id: string,
        public readonly revision: number,
        public readonly email: string,
    ) {}
}
