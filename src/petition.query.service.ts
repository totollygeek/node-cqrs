import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Petition } from './models/Petition';
import { GetAllQuery } from './query/GetAllQuery';
import { GetByIdQuery } from './query/GetByIdQuery';

@Injectable()
export class PetitionQueryService {
    constructor(private readonly queryBus: QueryBus) {}

    getAll(): Promise<Petition[]> {
        return this.queryBus.execute(new GetAllQuery());
    }

    getById(id: string): Promise<Petition> {
        return this.queryBus.execute(new GetByIdQuery(id));
    }
}
