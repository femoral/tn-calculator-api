import { Request } from 'express';
import { GetRecordQuery } from '../../src/records/record.controller';
import { ApiResponse } from '../../src/common/api.types';
import { Record } from '../../src/records/record.model';

export const buildGetRecordMock = (
  query: GetRecordQuery = {}
): Request<
  { userId: string; recordId: string },
  ApiResponse<Record[]>,
  void,
  GetRecordQuery
> => {
  return {
    params: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      recordId: '11',
    },
    session: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
    },
    query,
  } as unknown as Request<
    { userId: string; recordId: string },
    ApiResponse<Record[]>,
    void,
    GetRecordQuery
  >;
};

export const buildGetRecordWithUnmatchedUserMock = (): Request<{
  userId: string;
  recordId: string;
}> => {
  return {
    params: {
      userId: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      recordId: '11',
    },
    session: {
      userId: '462140c7-16ff-4e4d-864b-39561715a382',
    },
  } as unknown as Request<{ userId: string; recordId: string }>;
};

export const buildQueryRecords = () => {
  return {
    rows: [
      {
        id: 1,
        user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
        operation_id: 1,
        amount: '5.55',
        user_balance: '90',
        operation_response: '3',
        date: '2021-01-01',
        full_count: 2,
      },
      {
        id: 2,
        user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
        operation_id: 2,
        amount: '5',
        user_balance: '85',
        operation_response: '-10',
        date: '2021-01-02',
        full_count: 2,
      },
    ],
  };
};

export const buildResponseBodyMock = () => {
  return {
    data: [
      {
        id: 1,
        user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
        operation_id: 1,
        amount: '5.55',
        user_balance: '90',
        operation_response: '3',
        date: '2021-01-01',
      },
      {
        id: 2,
        user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
        operation_id: 2,
        amount: '5',
        user_balance: '85',
        operation_response: '-10',
        date: '2021-01-02',
      },
    ],
    metadata: {
      total_count: 2,
      page_size: 5,
      total_pages: 1,
    },
  };
};

const buildQueryResultWithNRecords = (numberOfRecords: number) => {
  return {
    rows: new Array(numberOfRecords).fill(0).map((_, i) => ({
      id: i + 1,
      user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      operation_id: 1,
      amount: '5.55',
      user_balance: '90',
      operation_response: '3',
      date: '2021-01-01',
      full_count: numberOfRecords,
    })),
  };
};

export const paginationScenarios = [
  {
    name: 'total count is less than page size',
    page_size: '10',
    queryResults: buildQueryResultWithNRecords(5),
    expectedMetadata: {
      total_count: 5,
      page_size: 10,
      total_pages: 1,
    },
  },
  {
    name: 'total count is equal to page size',
    page_size: '10',
    queryResults: buildQueryResultWithNRecords(10),
    expectedMetadata: {
      total_count: 10,
      page_size: 10,
      total_pages: 1,
    },
  },
  {
    name: 'total count is greater than page size',
    page_size: '10',
    queryResults: buildQueryResultWithNRecords(15),
    expectedMetadata: {
      total_count: 15,
      page_size: 10,
      total_pages: 2,
    },
  },
];

export const queryScenarios: {
  name: string;
  query: GetRecordQuery;
  expectedDbQueryParameters: unknown[];
}[] = [
  {
    name: 'page only',
    query: { page: '10' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      5,
      45,
    ],
  },
  {
    name: 'page_size and page',
    query: { page_size: '15', page: '2' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      15,
      15,
    ],
  },
  {
    name: 'id only',
    query: { id: 2 },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      2,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      5,
      0,
    ],
  },
  {
    name: 'user_id only',
    query: { user_id: 'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      5,
      0,
    ],
  },
  {
    name: 'operation_id only',
    query: { operation_id: 2 },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      2,
      undefined,
      undefined,
      undefined,
      undefined,
      5,
      0,
    ],
  },
  {
    name: 'amount only',
    query: { amount: '5' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      '5',
      undefined,
      undefined,
      undefined,
      5,
      0,
    ],
  },
  {
    name: 'user_balance only',
    query: { user_balance: '85' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      undefined,
      '85',
      undefined,
      undefined,
      5,
      0,
    ],
  },
  {
    name: 'operation_response only',
    query: { operation_response: '-10' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      undefined,
      undefined,
      '-10',
      undefined,
      5,
      0,
    ],
  },
  {
    name: 'date only',
    query: { date: '2021-01-02' },
    expectedDbQueryParameters: [
      'fb3e89e3-3a72-4af0-947a-f72b5e1ce93a',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '2021-01-02',
      5,
      0,
    ],
  },
];
