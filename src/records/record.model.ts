export type Record = {
  id: number;
  operation_id: number;
  user_id: string;
  amount: string;
  user_balance: string;
  operation_response: string;
  date: string;
};

export type GetRecordsRequest = {
  filter: Partial<Record>;
  page: number;
  page_size: number;
};

export type RecordsResult = {
  records: Record[];
  full_count: number;
};
