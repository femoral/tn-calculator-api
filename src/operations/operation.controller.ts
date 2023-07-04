import { TypedExpressHandler } from '../common/api.types';
import { Operation } from './operation.model';
import { GetOperationsInteractor } from './get-operations.interactor';

export type GetOperationsController = TypedExpressHandler<Operation[]>;

export const makeGetOperationsController = (dependencies: {
  getOperations: GetOperationsInteractor;
}): GetOperationsController => {
  return async (req, res) => {
    const operations = await dependencies.getOperations();
    res.json({ data: operations });
  };
};
