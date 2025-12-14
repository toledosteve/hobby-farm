import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { SessionsService } from '../../sessions/sessions.service';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      passReqToCallback: true, // This allows us to access the request in validate()
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    try {
      // Validate user exists
      const user = await this.authService.validateUser(payload.sub);

      // Extract token from request
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Validate session is still active
      const session = await this.sessionsService.findByToken(token);
      if (!session) {
        throw new UnauthorizedException('Session has been revoked');
      }

      // Update session activity
      await this.sessionsService.updateActivity(session._id.toString());

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }
}
