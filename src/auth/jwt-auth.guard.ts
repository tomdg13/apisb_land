import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if the route has @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If @Public(), skip JWT validation entirely
    if (isPublic) return true;

    // Check if route has @OptionalAuth() decorator
    const isOptional = this.reflector.getAllAndOverride<boolean>('isOptionalAuth', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isOptional) {
      // Try to parse JWT — if valid set req.user, if not just continue
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      if (!authHeader) return true; // no token — continue without user
      return super.canActivate(context);
    }

    // Otherwise run normal JWT guard (throws if no/invalid token)
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isOptional = this.reflector.getAllAndOverride<boolean>('isOptionalAuth', [
      context.getHandler(),
      context.getClass(),
    ]);
    // For optional routes — don't throw, just return null
    if (isOptional) return user ?? null;
    if (err || !user) throw err || new Error('Unauthorized');
    return user;
  }
}