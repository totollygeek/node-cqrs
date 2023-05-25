import { Module, Provider } from '@nestjs/common';
import { PetitionController } from './petition.controller';
import { PetitionService } from './petition.service';
import { PetitionQueryService } from './petition.query.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './domain/commands';
import { QueryHandlers } from './query';
import {
    IAggregateRepositoryToken,
    InMemoryAggregateRepository,
} from './domain/events/Repository';
import {
    IReadModelRepositoryToken,
    InMemoryReadModelRepository,
} from './query/ReadModelRepository';
import { EventHandlers } from './domain/events';

class Registrations {
    static addServices(): Provider[] {
        return [PetitionService, PetitionQueryService];
    }

    static addHandlers(): Provider[] {
        return [...CommandHandlers, ...QueryHandlers, ...EventHandlers];
    }

    static addInMemoryRepositories(): Provider[] {
        return [
            InMemoryAggregateRepository,
            {
                provide: IAggregateRepositoryToken,
                useExisting: InMemoryAggregateRepository,
            },
            InMemoryReadModelRepository,
            {
                provide: IReadModelRepositoryToken,
                useExisting: InMemoryReadModelRepository,
            },
        ];
    }
}

@Module({
    imports: [CqrsModule],
    controllers: [PetitionController],
    providers: [
        ...Registrations.addServices(),
        ...Registrations.addHandlers(),
        ...Registrations.addInMemoryRepositories(),
    ],
})
export class PetitionModule {}
