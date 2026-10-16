import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/infrastructure/http/global-exception.filter';
import { resolveAppOrigin } from './modules/auth/infrastructure/adapters/in/http/auth.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  // Same validated APP_URL source as the refresh-cookie policy, so CORS and
  // the cookie's SameSite decision cannot drift apart (M14).
  app.enableCors({
    origin: resolveAppOrigin(),
    credentials: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Clio E-commerce API')
    .setDescription('E-commerce backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);

  console.log(`Backend listening on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api/docs`);
}

// Safety net for fire-and-forget async work (e.g. event listeners): Node's
// default is to crash the process on an unhandled rejection. Log loudly and
// keep serving instead; the underlying failures are handled at their source.
process.on('unhandledRejection', (reason) => {
  console.error(
    '[process] Unhandled promise rejection:',
    reason instanceof Error ? (reason.stack ?? reason.message) : reason,
  );
});

void bootstrap();
