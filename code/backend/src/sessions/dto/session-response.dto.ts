export class SessionResponseDto {
  id: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  lastActiveAt: Date;
  createdAt: Date;
  isCurrent: boolean;

  constructor(partial: Partial<SessionResponseDto>) {
    Object.assign(this, partial);
  }
}
