import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import migrator from './db/migration';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Radiance API')
    .setDescription('API documentation for my project')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    }) // Optional: if you use JWT
    .build();

  app.enableCors({ origin: '*' });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await migrator();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`server started on port: `, process.env.PORT);
}
bootstrap();
