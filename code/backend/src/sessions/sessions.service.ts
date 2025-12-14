import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Session, SessionDocument } from './schemas/session.schema';
import { SessionResponseDto } from './dto/session-response.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  /**
   * Create a hash of the token for storage
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Parse user agent string to extract device info
   */
  private parseUserAgent(userAgent?: string): {
    deviceName?: string;
    browser?: string;
    os?: string;
  } {
    if (!userAgent) return {};

    let deviceName = 'Unknown Device';
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS X')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('iPhone')) os = 'iOS';
    else if (userAgent.includes('iPad')) os = 'iPadOS';
    else if (userAgent.includes('Android')) os = 'Android';

    // Detect browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg'))
      browser = 'Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
      browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    // Detect device
    if (userAgent.includes('iPhone')) deviceName = 'iPhone';
    else if (userAgent.includes('iPad')) deviceName = 'iPad';
    else if (userAgent.includes('Android')) deviceName = 'Android Device';
    else if (userAgent.includes('Windows')) deviceName = 'Windows PC';
    else if (userAgent.includes('Mac')) deviceName = 'Mac';
    else if (userAgent.includes('Linux')) deviceName = 'Linux PC';

    return { deviceName, browser, os };
  }

  /**
   * Create a new session or update existing one from same device
   */
  async createSession(
    userId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<SessionDocument> {
    const tokenHash = this.hashToken(token);
    const { deviceName, browser, os } = this.parseUserAgent(userAgent);

    // Check for existing active session from the same device/browser/IP
    const existingSession = await this.sessionModel.findOne({
      userId,
      ipAddress,
      userAgent,
      isActive: true,
    });

    if (existingSession) {
      // Update the existing session with new token
      existingSession.tokenHash = tokenHash;
      existingSession.lastActiveAt = new Date();
      return existingSession.save();
    }

    // Create new session if no matching one exists
    const session = new this.sessionModel({
      userId,
      tokenHash,
      deviceName,
      browser,
      os,
      ipAddress,
      userAgent,
      lastActiveAt: new Date(),
    });

    return session.save();
  }

  /**
   * Get all active sessions for a user
   */
  async findAllByUserId(userId: string): Promise<SessionDocument[]> {
    return this.sessionModel
      .find({ userId, isActive: true })
      .sort({ lastActiveAt: -1 })
      .exec();
  }

  /**
   * Update session activity
   */
  async updateActivity(sessionId: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      lastActiveAt: new Date(),
    });
  }

  /**
   * Find session by token
   */
  async findByToken(token: string): Promise<SessionDocument | null> {
    const tokenHash = this.hashToken(token);
    return this.sessionModel.findOne({ tokenHash, isActive: true });
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionModel.findByIdAndUpdate(sessionId, { isActive: false });
  }

  /**
   * Revoke all sessions except current one
   */
  async revokeAllExceptCurrent(
    userId: string,
    currentToken: string,
  ): Promise<number> {
    const currentTokenHash = this.hashToken(currentToken);

    const result = await this.sessionModel.updateMany(
      {
        userId,
        tokenHash: { $ne: currentTokenHash },
        isActive: true,
      },
      { isActive: false },
    );

    return result.modifiedCount;
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllSessions(userId: string): Promise<number> {
    const result = await this.sessionModel.updateMany(
      { userId, isActive: true },
      { isActive: false },
    );

    return result.modifiedCount;
  }

  /**
   * Convert session to response DTO
   */
  toSessionResponse(
    session: SessionDocument,
    currentTokenHash?: string,
  ): SessionResponseDto {
    const isCurrent = currentTokenHash
      ? session.tokenHash === currentTokenHash
      : false;

    return new SessionResponseDto({
      id: session._id.toString(),
      deviceName: session.deviceName,
      browser: session.browser,
      os: session.os,
      ipAddress: session.ipAddress,
      lastActiveAt: session.lastActiveAt,
      createdAt: session.createdAt,
      isCurrent,
    });
  }
}
