"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("../controller/users.controller");
const users_service_1 = require("../service/users.service");
const roles_controller_1 = require("../controller/roles.controller");
const roles_service_1 = require("../service/roles.service");
const sms_service_1 = require("../service/sms.service");
const axios_1 = require("@nestjs/axios");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [users_controller_1.usersController, roles_controller_1.RolesController],
        providers: [users_service_1.usersService, roles_service_1.RolesService, sms_service_1.SmsService],
        exports: [users_service_1.usersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map