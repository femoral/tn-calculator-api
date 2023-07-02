import { NextFunction, Request, Response } from 'express';

type TypedExpressRequest<
  TResponse = void,
  TRequest = void,
  TParams = unknown,
  TQuery = unknown
> = Request<
  TParams,
  TResponse extends void ? void : ApiResponse<TResponse>,
  TRequest,
  TQuery
>;

type TypedExpressResponse<TResponse> = Response<
  TResponse extends void ? void : ApiResponse<TResponse>
>;

export type TypedExpressHandler<
  TResponse = void,
  TRequest = void,
  TParams = unknown,
  TQuery = unknown
> = (
  req: TypedExpressRequest<TResponse, TRequest, TParams, TQuery>,
  res: TypedExpressResponse<TResponse>,
  next: NextFunction
) => void;

type ApiResponse<TData> = {
  data: TData;
  metadata?: {
    next_page_cursor?: string;
    page_size?: number;
  };
};
