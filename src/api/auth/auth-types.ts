import { User } from '../users/users-schema.js';

export interface UserLocalsAuthInfo {
  email: string;
}

export interface LoginResponse {
  accesToken: string;
}

export type AuthRequest = Pick<User, 'email' | 'password'>;
