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
      context.getHandler(),   // method-level metadata
      context.getClass(),     // class-level metadata
    ]);

    // If @Public(), skip JWT validation entirely
    if (isPublic) return true;

    // Otherwise run normal JWT guard
    return super.canActivate(context);
  }
}