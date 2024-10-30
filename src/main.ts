import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(); 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are provided
      transform: true, // Transform payloads to match DTO classes
      stopAtFirstError: true, // Stop validation at first error
      disableErrorMessages: true, // Show error messages (useful for development)
      skipMissingProperties: true,
      exceptionFactory: (errors) => {
        const errorMessages = errors.map(
          (error) =>
            `${error.property} has failed ${Object.values(error.constraints).join(', ')}`,
        );
        return new BadRequestException(errorMessages);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
