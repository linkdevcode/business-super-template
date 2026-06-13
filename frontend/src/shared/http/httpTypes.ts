export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  message?: string | null;
  errors: string[];
}

export interface AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  status: string;
  roles: string[];
  permissions: string[];
}

export interface AuthSessionDto {
  accessToken: string;
  expiresAt: string;
  user: AuthUserDto;
}
