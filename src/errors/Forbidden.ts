import HttpError from './HttpError';

export default class Forbidden extends HttpError {
  status: number;

  message: string;

  constructor(message?: string) {
    super();
    this.status = 403;
    this.message = message;
  }
}
