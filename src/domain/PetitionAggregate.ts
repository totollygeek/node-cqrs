import { AggregateRoot } from '@nestjs/cqrs';
import { Signer } from 'src/models/Signer';
import {
    IEventBase,
    PetitionClosed,
    PetitionCreated,
    SignerAdded,
    SignerRemoved,
} from './events/Events';

export class PetitionAggregate extends AggregateRoot<IEventBase> {
    private revision: number;
    private state: PetitionState;
    private title: string;
    private startTimestamp: Date;
    private signers: Map<string, Signer>;
    private endTimestamp: Date;

    constructor(public readonly id: string) {
        super();
        this.revision = 0;
        this.state = PetitionState.NotCreated;
        this.signers = new Map<string, Signer>();
    }

    load(events: IEventBase[]): void {
        this.loadFromHistory(events);
        this.revision = events.at(-1)?.revision ?? 0;
    }

    create(title: string, startTimestamp: Date): void {
        if (this.state !== PetitionState.NotCreated) {
            throw new Error('Petition is already created!');
        }

        this.revision++;
        this.apply(
            new PetitionCreated(this.id, this.revision, title, startTimestamp),
        );
    }

    sign(email: string, name: string): void {
        if (this.state !== PetitionState.Created) {
            throw new Error('Petition is not closed!');
        }

        if (this.signers.has(email)) {
            throw new Error('Signer already signed!');
        }

        this.revision++;
        this.apply(new SignerAdded(this.id, this.revision, email, name));
    }

    revoke(email: string): void {
        if (this.state !== PetitionState.Created) {
            throw new Error('Petition is not closed!');
        }

        if (!this.signers.has(email)) {
            throw new Error('Signer did not sign!');
        }

        this.revision++;
        this.apply(new SignerRemoved(this.id, this.revision, email));
    }

    close(endTimestamp: Date): void {
        if (this.state === PetitionState.Closed) {
            throw new Error('Petition is already closed!');
        }

        this.revision++;
        this.apply(new PetitionClosed(this.id, this.revision, endTimestamp));
    }

    private onPetitionCreated(event: PetitionCreated): void {
        this.state = PetitionState.Created;
        this.title = event.title;
        this.startTimestamp = event.startTimestamp;
    }

    private onSignerAdded(event: SignerAdded): void {
        this.signers.set(
            event.email,
            new Signer(this.id, event.email, event.name),
        );
    }

    private onSignerRemoved(event: SignerRemoved): void {
        this.signers.delete(event.email);
    }

    private onPetitionClosed(event: PetitionClosed): void {
        this.state = PetitionState.Closed;
        this.endTimestamp = event.endTimestamp;
    }
}

export enum PetitionState {
    NotCreated = 'not-created',
    Created = 'created',
    Closed = 'closed',
}
