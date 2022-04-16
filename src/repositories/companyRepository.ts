import connection from '../database/connection';
import { Company } from '../interfaces/Company';

export async function findByApiKey(apiKey: string): Promise<Company | null> {
  const result = await connection.query<Company, [string]>(
    'SELECT * FROM companies WHERE "apiKey"=$1',
    [apiKey]
  );
  if (!result.rowCount) return null;
  return result.rows[0];
}
