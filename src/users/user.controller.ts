import { TypedExpressHandler } from '../common/api.types';
import { CreateUserRequest, User } from './user.model';
import { CreateUserInteractor } from './create-user.interactor';
import { GetUserInteractor } from './get-user.interactor';
import { ForbiddenError } from '../common/error/errors';

export type PostUserController = TypedExpressHandler<User, CreateUserRequest>;

export const makePostUserController =
  (dependencies: { createUser: CreateUserInteractor }): PostUserController =>
  async (req, res) => {
    res.status(201).json({
      data: await dependencies.createUser(req.body),
    });
  };

export type GetUserController = TypedExpressHandler<User, void, { id: string }>;

export const makeGetUserController =
  (dependencies: { getUser: GetUserInteractor }): GetUserController =>
  async (req, res) => {
    if (req.session.userId !== req.params.id)
      throw new ForbiddenError('You are not allowed to access this resource');

    res.json({
      data: await dependencies.getUser(req.params.id),
    });
  };
