import { SetMetadata } from '@nestjs/common';

// Mark route as fully public (no JWT needed)
export const Public = () => SetMetadata('isPublic', true);

// Mark route as optional auth (JWT parsed if present, null if not)
export const OptionalAuth = () => SetMetadata('isOptionalAuth', true);