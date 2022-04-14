import connection from '../database/connection';
import { Company } from '../interfaces/Company';

export async function findByApiKey(apiKey: string) {
  const result = await connection.query<Company, [string]>(
    'SELECT * FROM companies WHERE "apiKey"=$1',
    [apiKey]
  );

  return result.rows[0];
}
