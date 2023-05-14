import { IAuthenticationDependencies } from './authentication.dependencies.js';
import { TokenHandler } from './authentication.token.js';
import { IAuthenticateUser } from './authentication.types.js';
import { Unauthorized } from '../errors/index.js';

export class AuthenticationService {
  private static instance: AuthenticationService;
  private readonly tokenHandler: TokenHandler;

  private constructor({ tokenHandler }: IAuthenticationDependencies) {
    this.tokenHandler = tokenHandler;
  }

  static getInstance(
    authDependencies: IAuthenticationDependencies
  ): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService(
        authDependencies
      );
    }

    return AuthenticationService.instance;
  }

  private isIAuthenticateUser(payload: unknown): payload is IAuthenticateUser {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'userId' in payload &&
      typeof payload.userId === 'string'
    );
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

  createToken(userId: string): string {
    return this.tokenHandler.createToken(userId);
  }
}
