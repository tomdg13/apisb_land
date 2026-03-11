"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalAuth = exports.Public = void 0;
const common_1 = require("@nestjs/common");
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
const OptionalAuth = () => (0, common_1.SetMetadata)('isOptionalAuth', true);
exports.OptionalAuth = OptionalAuth;
//# sourceMappingURL=decorators.js.map