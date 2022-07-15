import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docApiPath = resolve(process.cwd(), 'doc', 'api.yaml');
  const docApi = await readFile(docApiPath, 'utf-8');
  const document = parse(docApi);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
