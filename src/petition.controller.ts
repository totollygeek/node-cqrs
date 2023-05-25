import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
} from '@nestjs/common';
import { PetitionService } from './petition.service';
import { PetitionQueryService } from './petition.query.service';
import { Petition } from './models/Petition';
import { Signer } from './models/Signer';
import {
    IAggregateRepository,
    IAggregateRepositoryToken,
} from './domain/events/Repository';
import { IEventBase } from './domain/events/Events';

@Controller('petitions')
export class PetitionController {
    constructor(
        private readonly service: PetitionService,
        private readonly queryService: PetitionQueryService,
        @Inject(IAggregateRepositoryToken)
        protected readonly repository: IAggregateRepository,
    ) {}

    @Get()
    getAll(): Promise<Petition[]> {
        return this.queryService.getAll();
    }

    @Get('events')
    getEvents(): IEventBase[] {
        return this.repository.getEvents();
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<Petition> {
        try {
            return this.queryService.getById(id);
        } catch (e) {
            throw new HttpException((e as Error).message, 500);
        }
    }

    @Post()
    create(@Body() petition: { title: string }): Promise<void> {
        try {
            return this.service.create(petition.title);
        } catch (e) {
            throw new HttpException((e as Error).message, 500);
        }
    }

    @Post('sign')
    async sign(@Body() signer: Signer): Promise<void> {
        try {
            return await this.service.sign(
                signer.petitionId,
                signer.email,
                signer.name,
            );
        } catch (e) {
            throw new HttpException((e as Error).message, HttpStatus.CONFLICT);
        }
    }

    @Post('revoke')
    async revokeSign(@Body() signer: Signer): Promise<void> {
        try {
            return await this.service.revokeSignature(
                signer.petitionId,
                signer.email,
            );
        } catch (e) {
            throw new HttpException((e as Error).message, HttpStatus.CONFLICT);
        }
    }

    @Post('close')
    close(@Body() petition: { id: string }): Promise<void> {
        try {
            return this.service.close(petition.id);
        } catch (e) {
            throw new HttpException((e as Error).message, 500);
        }
    }
}
