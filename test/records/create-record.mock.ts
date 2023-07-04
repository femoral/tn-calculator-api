import { OperationType } from '../../src/operations/operation.model';
import { Request } from 'express';

export const buildUserBalanceQueryMock = (balance: string) => {
  return {
    rows: [
      {
        balance,
      },
    ],
  };
};
export const buildInsertedRecordQueryMock = (result = '3') => ({
  rows: [
    {
      id: '1',
      user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      operation_id: '1',
      amount: '5.55',
      user_balance: '90',
      operation_response: result,
      date: '2021-01-01',
    },
  ],
});
export const buildGetOperationByTypeQueryMock = (
  type: OperationType = 'ADDITION'
) => ({
  rows: [
    {
      id: 1,
      type: type,
      cost: '5.55',
    },
  ],
});

export const buildOperationExecutionRequestMock = ({
  operation_type = 'ADDITION',
  operands = ['1', '2'],
  missMatchUserId = false,
}: {
  operation_type?: OperationType;
  operands?: string[] | null;
  missMatchUserId?: boolean;
}) =>
  ({
    body: {
      operation_type,
      operands,
    },
    session: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
    params: {
      userId: missMatchUserId
        ? '462140c7-16ff-4e4d-864b-39561715a382'
        : 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
  } as unknown as Request<{ userId: string }>);

export const buildOperationExecutionApiResponse = (result = '3') => ({
  data: {
    id: '1',
    user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    operation_id: '1',
    amount: '5.55',
    user_balance: '90',
    operation_response: result,
    date: '2021-01-01',
  },
});
export const buildInsertedRecord = (result = '3') => [
  1,
  'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
  '5.55',
  '94.45',
  result,
];
