import { TypedExpressHandler } from '../common/api.types';
import { Record } from './record.model';
import { ExecuteOperationInteractor } from './execute-operation.interactor';
import { OperationExecution } from '../operations/operation.model';
import { ForbiddenError } from '../common/error/errors';

export type PostRecordController = TypedExpressHandler<
  Record,
  OperationExecution,
  { userId: string }
>;

export const makePostRecordController =
  (dependencies: {
    executeOperation: ExecuteOperationInteractor;
  }): PostRecordController =>
  async (req, res) => {
    if (req.session.userId !== req.params.userId)
      throw new ForbiddenError('You are not allowed to access this resource');

    res.status(201).json({
      data: await dependencies.executeOperation(req.body, {
        session: req.session,
      }),
    });
  };
