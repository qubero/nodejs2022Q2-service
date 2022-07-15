import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

const PORT = parseInt(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());

  const docApiPath = resolve(process.cwd(), 'doc', 'api.yaml');
  const docApi = await readFile(docApiPath, 'utf-8');
  const document = parse(docApi);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
