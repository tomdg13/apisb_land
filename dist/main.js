"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const bodyParser = require("body-parser");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.use(bodyParser.json({ limit: '30mb' }));
    app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
    app.enableCors({
        origin: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    });
    app.useStaticAssets(process.cwd() + '/uploads', {
        prefix: '/uploads',
        setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(2112);
    console.log('✅ Application is running on: http://localhost:2112');
    console.log('✅ CORS enabled for all origins');
}
bootstrap().catch(error => {
    console.error('❌ Error starting application:', error);
});
//# sourceMappingURL=main.js.map