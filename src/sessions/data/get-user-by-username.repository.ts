import { Pool } from 'pg';
import { NotFoundError } from '../../common/error/errors';
import { GetUserByUsernameRepository } from '../create-session.interactor';

const statement = `select id, username, balance, password from "user" where username = $1 and status = 'ENABLED'`;

export const makeGetUserByUsernameRepository =
  (dependencies: { pool: Pool }): GetUserByUsernameRepository =>
  async (id: string) => {
    const result = await dependencies.pool.query(statement, [id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError('User not found');

    return {
      id: user.id,
      username: user.username,
      balance: user.balance,
      password: user.password,
    };
  };
