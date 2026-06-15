export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  message?: string | null;
  errors: string[];
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  status: string;
  roles: string[];
  permissions: string[];
}

export interface AuthSessionDto {
  accessToken: string;
  expiresAt: string;
  user: AuthUserDto;
}
