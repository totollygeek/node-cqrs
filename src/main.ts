import { NestFactory } from '@nestjs/core';
import { PetitionModule } from './petition.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(PetitionModule);

    const config = new DocumentBuilder()
        .setTitle('Petition Example')
        .setDescription('The petition API description')
        .setVersion('1.0')
        .addTag('petition')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
