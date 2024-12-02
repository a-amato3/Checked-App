export class AppError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public error?: any
    ) {
      super(message);
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
      super(404, message, 'fail');
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(400, message, 'fail');
    }
  }