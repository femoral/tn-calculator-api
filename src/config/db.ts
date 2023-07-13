import { getFromEnv } from './env';
import { PoolConfig } from 'pg';

export const getDataBaseUrl = (): PoolConfig => {
  const host = getFromEnv('DB_HOST', 'localhost');
  const port = getFromEnv('DB_PORT', '5432');
  const database = getFromEnv('DB_DATABASE', 'postgres');
  const password = getFromEnv('DB_PASSWORD', 'localpassword');
  const user = getFromEnv('DB_USER', 'postgres');
  const schema = getFromEnv('DB_SCHEMA', 'public');

  return {
    connectionString: `postgres://${user}:${password}@${host}:${port}/${database}?schema=${schema}`,
    min: +getFromEnv('DB_POOL_MIN', '1'),
    max: +getFromEnv('DB_POOL_MAX', '10'),
  };
};
