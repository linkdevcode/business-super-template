import type { AuthSessionDto, AuthUserDto } from "../../../shared/http/httpTypes";

export type { AuthSessionDto, AuthUserDto };

export interface LoginInput {
  email: string;
  password: string;
}
