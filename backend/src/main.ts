import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('EventPass API')
    .setDescription(
      'API REST complète pour la plateforme de billetterie EventPass. ' +
        'Gestion d\'événements, commandes, billets, utilisateurs, lieux et catégories.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Endpoints pour l\'authentification et l\'inscription')
    .addTag('Events', 'Gestion des événements avec recherche avancée')
    .addTag('Orders', 'Gestion des commandes et achats de billets')
    .addTag('Tickets', 'Gestion des billets individuels')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Venues', 'Gestion des lieux d\'événements')
    .addTag('Categories', 'Gestion des catégories d\'événements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'EventPass API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('');
  console.log('🚀 ================================');
  console.log('   EventPass API - READY');
  console.log('   ================================');
  console.log(`   📍 API Base:     http://localhost:${port}/api`);
  console.log(`   📚 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log('   ================================');
  console.log('');
}
bootstrap();
