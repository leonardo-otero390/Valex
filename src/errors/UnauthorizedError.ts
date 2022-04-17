import HttpError from './HttpError';

export default class Unauthorized extends HttpError {
  status: number;

  message: string;

  constructor(message?: string) {
    super();
    this.status = 401;
    this.message = message;
  }
}
