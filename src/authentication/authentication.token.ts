import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAuthenticateUser } from './authentication.types';

export interface TokenHandler {
  createToken(payload: IAuthenticateUser): string;
  getPayload(token: string): unknown;
}

export class MockTokenHandler implements TokenHandler {
  private constructor(private secretKey: string) {}

  static init(): MockTokenHandler {
    return new MockTokenHandler('');
  }

  withSecretKey(secretKey: string): MockTokenHandler {
    this.secretKey = secretKey;
    return this;
  }

  createToken(payload: IAuthenticateUser): string {
    const token = {
      payload,
      secretKey: this.secretKey,
      expiresIn: '24h',
    };

    return JSON.stringify(token);
  }

  getPayload(token: string): string | JwtPayload {
    return JSON.parse(token);
  }
}

export class JwtTokenHandler implements TokenHandler {
  private static instance: JwtTokenHandler;
  private readonly secretKey: string;

  private constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  public static getInstance(secretKey: string): JwtTokenHandler {
    if (!JwtTokenHandler.instance) {
      JwtTokenHandler.instance = new JwtTokenHandler(secretKey);
    }

    return JwtTokenHandler.instance;
  }

  createToken(payload: IAuthenticateUser): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: '24h',
    });
  }

  getPayload(token: string): string | JwtPayload {
    return jwt.verify(token, this.secretKey);
  }
}
