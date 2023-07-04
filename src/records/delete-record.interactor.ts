import { Context } from '../common/api.types';

export type DeleteRecordInteractor = (
  recordId: number,
  context: Context
) => Promise<void>;

export type DeleteRecordByIdRepository = (
  recordId: number,
  context: Context
) => Promise<void>;

export const makeDeleteRecordInteractor =
  (dependencies: {
    deleteRecordById: DeleteRecordByIdRepository;
  }): DeleteRecordInteractor =>
  async (recordId, context) => {
    return await dependencies.deleteRecordById(recordId, context);
  };
