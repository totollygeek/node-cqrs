import { IEventBase } from './Events';
import { PetitionAggregate } from '../PetitionAggregate';

export interface IAggregateRepository {
    getEvents(): IEventBase[];
    save(aggregate: PetitionAggregate): Promise<void>;
    get(aggregateId: string): Promise<PetitionAggregate>;
}

export const IAggregateRepositoryToken = Symbol('IAggregateRepository');

export class InMemoryAggregateRepository implements IAggregateRepository {
    private readonly events: IEventBase[] = [];

    async get(aggregateId: string): Promise<PetitionAggregate> {
        const events = this.events
            .filter((e) => e.id === aggregateId)
            .sort((a, b) => a.revision - b.revision);

        const aggregate = new PetitionAggregate(aggregateId);
        aggregate.load(events);
        return aggregate;
    }

    async save(aggregate: PetitionAggregate): Promise<void> {
        this.events.push(...aggregate.getUncommittedEvents());
        aggregate.commit();
    }

    getEvents(): IEventBase[] {
        return this.events;
    }
}
