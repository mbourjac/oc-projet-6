import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenHandler {
  createToken(identifier: string): string;
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

  createToken(id: string): string {
    const token = {
      userId: id,
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

  createToken(id: string): string {
    return jwt.sign({ userId: id }, this.secretKey, {
      expiresIn: '24h',
    });
  }

  getPayload(token: string): string | JwtPayload {
    return jwt.verify(token, this.secretKey);
  }
}
