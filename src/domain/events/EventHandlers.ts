import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
    IEventBase,
    PetitionClosed,
    PetitionCreated,
    SignerAdded,
    SignerRemoved,
} from './Events';
import { Inject } from '@nestjs/common';
import {
    IReadModelRepository,
    IReadModelRepositoryToken,
} from 'src/query/ReadModelRepository';
import { Petition, State } from 'src/models/Petition';
import { Participant } from 'src/models/Participant';

export abstract class BaseEventHandler<TEvent extends IEventBase>
    implements IEventHandler<TEvent>
{
    constructor(
        @Inject(IReadModelRepositoryToken)
        protected readonly repository: IReadModelRepository,
    ) {}
    abstract handle(event: TEvent): Promise<void>;
}

@EventsHandler(PetitionCreated)
export class PetitionCreatedEventHandler extends BaseEventHandler<PetitionCreated> {
    async handle(event: PetitionCreated): Promise<void> {
        const petition = new Petition(
            event.id,
            event.title,
            event.startTimestamp,
        );
        petition.state = State.Created;
        await this.repository.save(petition);
    }
}

@EventsHandler(PetitionClosed)
export class PetitionClosedEventHandler extends BaseEventHandler<PetitionClosed> {
    async handle(event: PetitionClosed): Promise<void> {
        const petition = await this.repository.getById(event.id);
        petition.state = State.Closed;
        await this.repository.save(petition);
    }
}

@EventsHandler(SignerAdded)
export class SignerAddedEventHandler extends BaseEventHandler<SignerAdded> {
    async handle(event: SignerAdded): Promise<void> {
        const petition = await this.repository.getById(event.id);
        petition.participants.push(new Participant(event.email, event.name));
        await this.repository.save(petition);
    }
}

@EventsHandler(SignerRemoved)
export class SignerRemovedEventHandler extends BaseEventHandler<SignerRemoved> {
    async handle(event: SignerRemoved): Promise<void> {
        const petition = await this.repository.getById(event.id);
        petition.participants = petition.participants.filter(
            (p) => p.email !== event.email,
        );
        await this.repository.save(petition);
    }
}
