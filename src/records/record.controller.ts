import { TypedExpressHandler } from '../common/api.types';
import { Record } from './record.model';
import { ExecuteOperationInteractor } from './execute-operation.interactor';
import { OperationExecution } from '../operations/operation.model';
import { ForbiddenError } from '../common/error/errors';
import { GetRecordsInteractor } from './get-records.interactor';
import { DeleteRecordInteractor } from './delete-record.interactor';

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

export type GetRecordQuery = Partial<Record> & {
  page?: string;
  page_size?: string;
};

export type GetRecordsController = TypedExpressHandler<
  Record[],
  void,
  { userId: string },
  GetRecordQuery
>;

export const makeGetRecordsController =
  (dependencies: { getRecords: GetRecordsInteractor }): GetRecordsController =>
  async (req, res) => {
    if (req.session.userId !== req.params.userId)
      throw new ForbiddenError('You are not allowed to access this resource');

    const { page = '1', page_size = '5', ...filter } = req.query;
    const castedPage = +page;
    const castedPageSize = +page_size;

    const result = await dependencies.getRecords(
      {
        page: castedPage,
        page_size: castedPageSize,
        filter,
      },
      { session: req.session }
    );

    res.status(200).json({
      data: result.records,
      metadata: {
        page_size: castedPageSize,
        total_count: result.full_count,
        total_pages: Math.ceil(result.full_count / castedPageSize),
      },
    });
  };

export type DeleteRecordController = TypedExpressHandler<
  void,
  void,
  { userId: string; recordId: string }
>;

export const makeDeleteRecordController =
  (dependencies: {
    deleteRecord: DeleteRecordInteractor;
  }): DeleteRecordController =>
  async (req, res) => {
    if (req.session.userId !== req.params.userId)
      throw new ForbiddenError('You are not allowed to access this resource');

    await dependencies.deleteRecord(+req.params.recordId, {
      session: req.session,
    });

    res.status(204).end();
  };
