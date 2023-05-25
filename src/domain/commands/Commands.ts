import { ICommand } from '@nestjs/cqrs';

export class CreatePetitionCommand implements ICommand {
    constructor(public readonly title: string) {}
}

export class ClosePetitionCommand implements ICommand {
    constructor(public readonly id: string) {}
}

export class SignPetitionCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly name: string,
    ) {}
}

export class RevokePetitionSignatureCommand implements ICommand {
    constructor(public readonly id: string, public readonly email: string) {}
}
