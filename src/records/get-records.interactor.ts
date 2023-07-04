import { GetRecordsRequest, RecordsResult } from './record.model';
import { Context } from '../common/api.types';

export type GetRecordsInteractor = (
  request: GetRecordsRequest,
  context: Context
) => Promise<RecordsResult>;

export type GetRecordsByUserIdRepository = (
  request: GetRecordsRequest,
  context: Context
) => Promise<RecordsResult>;

export const makeGetRecordsInteractor =
  (dependencies: {
    getRecordsByUserId: GetRecordsByUserIdRepository;
  }): GetRecordsInteractor =>
  async (request, context) => {
    return await dependencies.getRecordsByUserId(request, context);
  };
