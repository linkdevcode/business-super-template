export interface UserListItemDto {
  id: string;
  email: string;
  fullName: string;
  status: string;
  avatarUrl?: string | null;
  roleNames: string[];
  roleIds: string[];
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface UserDetailDto {
  id: string;
  email: string;
  fullName: string;
  status: string;
  avatarUrl?: string | null;
  roleIds: string[];
  roleNames: string[];
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  status: string;
  roles: string[];
}

export interface UpdateUserStatusInput {
  status: string;
}

export interface AssignUserRolesInput {
  roleIds: string[];
}

export interface UpdateProfileInput {
  fullName: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
