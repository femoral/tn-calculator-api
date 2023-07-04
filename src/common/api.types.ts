import { RequestHandler } from 'express';
import Session = Express.Session;

export type TypedExpressHandler<
  TResponse = void,
  TRequest = void,
  TParams = unknown,
  TQuery = unknown
> = RequestHandler<
  TParams,
  TResponse extends void ? void : ApiResponse<TResponse>,
  TRequest,
  TQuery
>;

export type ApiResponse<TData> = {
  data: TData;
  metadata?: {
    page_size?: number;
    total_count?: number;
    total_pages?: number;
  };
};

export type Context = {
  session: Session;
};
