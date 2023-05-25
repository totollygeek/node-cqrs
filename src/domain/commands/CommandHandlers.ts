import * as crypto from 'crypto';
import {
    CommandHandler,
    EventPublisher,
    ICommand,
    ICommandHandler,
} from '@nestjs/cqrs';
import {
    CreatePetitionCommand,
    ClosePetitionCommand,
    SignPetitionCommand,
    RevokePetitionSignatureCommand,
} from './Commands';
import { PetitionAggregate } from '../PetitionAggregate';
import { Inject } from '@nestjs/common';
import {
    IAggregateRepository,
    IAggregateRepositoryToken,
} from '../events/Repository';

export abstract class BaseCommandHandler<TCommand extends ICommand>
    implements ICommandHandler<TCommand>
{
    constructor(
        @Inject(IAggregateRepositoryToken)
        protected readonly repository: IAggregateRepository,
        protected readonly publisher: EventPublisher,
    ) {}

    protected async getFromRepository(
        aggregateId: string,
    ): Promise<PetitionAggregate> {
        return this.publisher.mergeObjectContext(
            await this.repository.get(aggregateId),
        );
    }

    abstract execute(command: TCommand): Promise<void>;
}

@CommandHandler(CreatePetitionCommand)
export class CreatePetitionCommandHandler extends BaseCommandHandler<CreatePetitionCommand> {
    async execute(command: CreatePetitionCommand): Promise<void> {
        const petitionId = crypto.randomUUID();
        const petition = this.publisher.mergeObjectContext(
            new PetitionAggregate(petitionId),
        );
        petition.create(command.title, new Date());
        await this.repository.save(petition);
    }
}

@CommandHandler(SignPetitionCommand)
export class SignPetitionCommandHandler extends BaseCommandHandler<SignPetitionCommand> {
    async execute(command: SignPetitionCommand): Promise<void> {
        const aggregate = await this.getFromRepository(command.id);
        aggregate.sign(command.email, command.name);
        await this.repository.save(aggregate);
    }
}

@CommandHandler(RevokePetitionSignatureCommand)
export class RevokePetitionSignatureCommandHandler extends BaseCommandHandler<RevokePetitionSignatureCommand> {
    async execute(command: RevokePetitionSignatureCommand): Promise<void> {
        const aggregate = await this.getFromRepository(command.id);
        aggregate.revoke(command.email);
        await this.repository.save(aggregate);
    }
}

@CommandHandler(ClosePetitionCommand)
export class ClosePetitionCommandHandler extends BaseCommandHandler<ClosePetitionCommand> {
    async execute(command: ClosePetitionCommand): Promise<void> {
        const aggregate = await this.getFromRepository(command.id);
        aggregate.close(new Date());
        await this.repository.save(aggregate);
    }
}
