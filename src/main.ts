import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Back Agenda API')
    .setDescription(
      'API para sistema de agendamento de quadras esportivas com autenticação JWT e controle de conflitos de horários',
    )
    .setVersion('1.1.0')
    .addBearerAuth()
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('users', 'Gestão de usuários')
    .addTag('courts', 'Gestão de quadras')
    .addTag('bookings', 'Gestão de agendamentos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
