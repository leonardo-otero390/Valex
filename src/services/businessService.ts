import NotFound from '../errors/NotFoundError';
import * as businessRepository from '../repositories/businessRepository';

export async function find(id: number) {
  const result = await businessRepository.findById(id);
  if (!result) throw new NotFound('Business not found');
  return result;
}
