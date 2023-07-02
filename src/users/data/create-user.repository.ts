import { CreateUserRepository } from '../create-user.interactor';
import { Pool } from 'pg';
import { Password } from '../../common/crypto/password';

const statement = `insert into "user" (username, password, balance) values ($1, $2, $3) returning id, username, balance`;

export const makeCreateUserRepository =
  (dependencies: { pool: Pool; password: Password }): CreateUserRepository =>
  async (user) => {
    const result = await dependencies.pool.query(statement, [
      user.username,
      await dependencies.password.hash(user.password),
      user.balance,
    ]);
    const insertedUser = result.rows[0];

    return {
      id: insertedUser.id,
      username: insertedUser.username,
      balance: insertedUser.balance,
    };
  };
