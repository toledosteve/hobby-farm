export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  phoneNumber?: string;
  timezone?: string;
  preferredUnits?: string;
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
