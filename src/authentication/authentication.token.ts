import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenHandler {
  createToken(identifier: string): string;
  getPayload(token: string): unknown;
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
