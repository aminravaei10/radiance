// import { INestApplication } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// export async function configureApp(app: INestApplication): Promise<void> {
//   const configService = app.get(ConfigService);

//   const options = new DocumentBuilder()
//     .setTitle('user service')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, options);

//   if (configService.get<boolean>('SET_PREFIX_TO_ADMIN_URLS') === false) {
//     const prefix = configService.get<string>('PREFIX');
//     const modifiedPaths = {};

//     Object.entries(document.paths).forEach(([path, value]) => {
//       if (path.startsWith(prefix + '/admin')) {
//         modifiedPaths['/' + path.replace(prefix + '/admin', 'admin')] = value;
//       } else {
//         modifiedPaths[path] = value;
//       }
//     });

//     document.paths = modifiedPaths;
//   }

//   const baseApiUrl = configService.get<string>('BASE_API_URL'); // Main API base URL
//   const swaggerBaseUrl = configService.get<string>('SWAGGER_BASE_URL'); // Swagger base URL

//   // Add server URLs
//   document.servers = [
//     { url: baseApiUrl as string, description: 'Main Server' },
//     { url: swaggerBaseUrl as string, description: 'Swagger Server' },
//   ];

//   SwaggerModule.setup('/swagger', app, document);
// }
