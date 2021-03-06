import connection from '../database/connection';
import { Business } from '../interfaces/Business';

export async function findById(id: number) {
  const result = await connection.query<Business, [number]>(
    'SELECT * FROM businesses WHERE id=$1',
    [id]
  );
  if (!result.rowCount) return null;
  return result.rows[0];
}
