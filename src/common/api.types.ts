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

type ApiResponse<TData> = {
  data: TData;
  metadata?: {
    next_page_cursor?: string;
    page_size?: number;
  };
};

export type Context = {
  session: Session;
};
