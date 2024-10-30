import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';


@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400; // Bad Request

    response.status(status).json({
      statusCode: status,
      message: this.parseErrorMessage(exception),
    });
  }

  private parseErrorMessage(exception: PrismaClientKnownRequestError): string {
    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        return 'A unique constraint would be violated on resource';
      case 'P2001': // No record found
        return 'No record found for provided data';
      // Add more cases as necessary
      default:
        return exception.message || 'An unexpected error occurred';
    }
  }
}
