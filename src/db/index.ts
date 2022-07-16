import { Injectable } from '@nestjs/common';

@Injectable()
export default class InMemoryDB<T extends { id?: string }> {
  private entities: T[] = [];

  async findAll(): Promise<T[]> {
    return Promise.resolve(this.entities);
  }

  async findOneById(id: T['id']): Promise<T | undefined> {
    return Promise.resolve(this.entities.find((entity) => entity.id === id));
  }

  async create(createdEntity: T): Promise<T> {
    return new Promise((resolve) => {
      this.entities.push(createdEntity);
      resolve(createdEntity);
    });
  }

  async update(id: T['id'], updatedEntity: T): Promise<T | void> {
    return new Promise((resolve) => {
      const entityIdx = this.entities.findIndex((entity) => entity.id === id);

      this.entities[entityIdx] = updatedEntity;
      resolve(this.entities[entityIdx]);
    });
  }

  async removeById(id: T['id']): Promise<void> {
    return new Promise((resolve) => {
      this.entities = this.entities.filter((entity) => entity.id !== id);
      resolve();
    });
  }
}
