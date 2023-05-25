import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from './GetAllQuery';
import { Petition } from 'src/models/Petition';
import {
    IReadModelRepository,
    IReadModelRepositoryToken,
} from './ReadModelRepository';
import { GetByIdQuery } from './GetByIdQuery';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
    implements IQueryHandler<GetAllQuery, Petition[]>
{
    constructor(
        @Inject(IReadModelRepositoryToken)
        private readonly repository: IReadModelRepository,
    ) {}

    execute(query: GetAllQuery): Promise<Petition[]> {
        return this.repository.getAll();
    }
}

@QueryHandler(GetByIdQuery)
export class GetByIdQueryHandler
    implements IQueryHandler<GetByIdQuery, Petition>
{
    constructor(
        @Inject(IReadModelRepositoryToken)
        private readonly repository: IReadModelRepository,
    ) {}

    execute(query: GetByIdQuery): Promise<Petition> {
        return this.repository.getById(query.id);
    }
}
