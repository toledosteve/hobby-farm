import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async findAll(@Request() req) {
    const sessions = await this.sessionsService.findAllByUserId(req.user.id);
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    const currentTokenHash = currentToken
      ? require('crypto').createHash('sha256').update(currentToken).digest('hex')
      : undefined;

    return sessions.map((session) =>
      this.sessionsService.toSessionResponse(session, currentTokenHash),
    );
  }

  @Delete(':id')
  async revokeSession(@Request() req, @Param('id') sessionId: string) {
    await this.sessionsService.revokeSession(sessionId, req.user.id);
    return { message: 'Session revoked successfully' };
  }

  @Delete()
  async revokeAllExceptCurrent(@Request() req) {
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    if (!currentToken) {
      throw new Error('No authorization token found');
    }

    const count = await this.sessionsService.revokeAllExceptCurrent(
      req.user.id,
      currentToken,
    );

    return { message: `${count} session(s) revoked successfully` };
  }
}
