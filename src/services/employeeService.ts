import NotFound from '../errors/NotFoundError';
import * as employeeRepository from '../repositories/employeeRepository';
import { Employee } from '../interfaces/Employee';

export async function find(id: number): Promise<Employee> {
  const result = await employeeRepository.findById(id);
  if (!result) throw new NotFound('Employee not found');
  return result;
}
