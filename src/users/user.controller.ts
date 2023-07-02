import { TypedExpressHandler } from '../common/api.types';
import { CreateUserRequest, User } from './user.model';
import { CreateUserInteractor } from './create-user.interactor';
import { GetUserInteractor } from './get-user.interactor';

export type PostUserController = TypedExpressHandler<User, CreateUserRequest>;

export const makePostUserController =
  (dependencies: {
    createUserInteractor: CreateUserInteractor;
  }): PostUserController =>
  async (req, res) => {
    const response = res.status(201);
    response.json({
      data: await dependencies.createUserInteractor(req.body),
    });
  };

export type GetUserController = TypedExpressHandler<User, void, { id: string }>;

export const makeGetUserController =
  (dependencies: { getUserInteractor: GetUserInteractor }): GetUserController =>
  async (req, res) => {
    res.json({
      data: await dependencies.getUserInteractor(req.params.id),
    });
  };
