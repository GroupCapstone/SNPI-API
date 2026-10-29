import { createHash, randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export interface JwtTokenPayload {
  userId: string;
  username?: string;
  email?: string;
  type: 'access' | 'refresh';
  tokenVersion?: number;
}

export class TokenUtil {
  public static generateAccessToken(payload: {
    userId: string;
    username: string;
    email: string;
    tokenVersion?: number;
  }): string {
    return jwt.sign(
      {
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
        type: 'access',
        tokenVersion: payload.tokenVersion ?? 0,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );
  }

  public static generateRefreshToken(payload: { userId: string; tokenVersion?: number }): string {
    return jwt.sign(
      {
        userId: payload.userId,
        type: 'refresh',
        tokenVersion: payload.tokenVersion ?? 0,
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        jwtid: randomUUID(),
      },
    );
  }

  public static verifyAccessToken(token: string): JwtTokenPayload {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const payload = decoded as JwtTokenPayload;
    if (payload.type !== 'access') {
      throw new Error('Invalid access token type');
    }
    return payload;
  }

  public static verifyRefreshToken(token: string): JwtTokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const payload = decoded as JwtTokenPayload;
    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token type');
    }
    return payload;
  }

  public static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
