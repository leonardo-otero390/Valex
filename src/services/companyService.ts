import NotFound from '../errors/NotFoundError';
import * as companyRepository from '../repositories/companyRepository';

export async function findByApiKey(apiKey: string) {
  const result = await companyRepository.findByApiKey(apiKey);
  if (!result) throw new NotFound('Company not found');
  return result;
}
