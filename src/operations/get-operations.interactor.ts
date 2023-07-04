import { Operation } from './operation.model';

export type GetOperationsInteractor = () => Promise<Operation[]>;
export type GetOperationsRepository = () => Promise<Operation[]>;

export const makeGetOperationsInteractor =
  (dependencies: {
    getOperations: GetOperationsRepository;
  }): GetOperationsInteractor =>
  async () => {
    return await dependencies.getOperations();
  };
