import { IAuthnDependencies } from './authn.dependencies';
import { TokenHandler } from './authn.token';
import { IAuthenticateUser } from './authn.types';
import { Unauthorized } from '../errors/index';

export class AuthnService {
  private static instance: AuthnService;
  private readonly tokenHandler: TokenHandler;

  constructor({ tokenHandler }: IAuthnDependencies) {
    this.tokenHandler = tokenHandler;
  }

  static getInstance(authDependencies: IAuthnDependencies): AuthnService {
    if (!AuthnService.instance) {
      AuthnService.instance = new AuthnService(authDependencies);
    }

    return AuthnService.instance;
  }

  createToken(userId: string): string {
    const payload = { userId };

    return this.tokenHandler.createToken(payload);
  }

  authenticateUser(authHeader: string | undefined): string {
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new Unauthorized('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const payload: unknown = this.tokenHandler.getPayload(token);

    if (!this.isIAuthenticateUser(payload)) {
      throw new Unauthorized('Invalid payload');
    }

    return payload.userId;
  }

  private isIAuthenticateUser(payload: unknown): payload is IAuthenticateUser {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'userId' in payload &&
      typeof payload.userId === 'string'
    );
  }
}
