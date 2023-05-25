import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    CreatePetitionCommand,
    SignPetitionCommand,
    RevokePetitionSignatureCommand,
    ClosePetitionCommand,
} from './domain/commands/Commands';

@Injectable()
export class PetitionService {
    constructor(private commandBus: CommandBus) {}

    create(title: string): Promise<void> {
        return this.commandBus.execute(new CreatePetitionCommand(title));
    }

    sign(id: string, email: string, name: string): Promise<void> {
        return this.commandBus.execute(
            new SignPetitionCommand(id, email, name),
        );
    }

    revokeSignature(id: string, email: string): Promise<void> {
        return this.commandBus.execute(
            new RevokePetitionSignatureCommand(id, email),
        );
    }

    close(id: string): Promise<void> {
        return this.commandBus.execute(new ClosePetitionCommand(id));
    }
}
