import { Petition } from 'src/models/Petition';

export interface IReadModelRepository {
    save(model: Petition): Promise<void>;

    getAll(): Promise<Petition[]>;

    getById(id: string): Promise<Petition>;
}

export const IReadModelRepositoryToken = Symbol('IReadModelRepository');

export class InMemoryReadModelRepository implements IReadModelRepository {
    private readonly petitions: Map<string, Petition> = new Map<
        string,
        Petition
    >();

    async save(model: Petition): Promise<void> {
        this.petitions.set(model.id, model);
    }

    async getAll(): Promise<Petition[]> {
        return [...this.petitions.values()];
    }

    async getById(id: string): Promise<Petition> {
        if (!this.petitions.has(id)) {
            throw new Error('Petition not found');
        }

        return this.petitions.get(id)!;
    }
}
