import { TypedExpressHandler } from '../common/api.types';
import { UserCredentials } from './session.model';
import { CreateSessionInteractor } from './create-session.interactor';
import { DeleteSessionInteractor } from './delete-session.interactor';

const SESSION_COOKIE = 'SESSION';
const ONE_HOUR = 1000 * 60 * 60;

export type PostSessionController = TypedExpressHandler<void, UserCredentials>;

export const makePostSessionController =
  (dependencies: {
    createSession: CreateSessionInteractor;
  }): PostSessionController =>
  async (req, res) => {
    const token = await dependencies.createSession(req.body);
    res
      .cookie(SESSION_COOKIE, token, {
        secure: true,
        httpOnly: true,
        maxAge: ONE_HOUR,
        path: '/',
        sameSite: true,
      })
      .status(201)
      .end();
  };

export type DeleteSessionController = TypedExpressHandler;

export const makeDeleteSessionController =
  (dependencies: {
    deleteSession: DeleteSessionInteractor;
  }): DeleteSessionController =>
  async (req, res) => {
    await dependencies.deleteSession(req.cookies.SESSION);

    res.clearCookie(SESSION_COOKIE).status(204).end();
  };
