import { JwtTokenHandler, TokenHandler } from './authentication.token.js';

export interface IAuthenticationDependencies {
  tokenHandler: TokenHandler;
}

class AuthenticationDependencies implements IAuthenticationDependencies {
  readonly tokenHandler: TokenHandler;

  constructor() {
    const secretTokenKey = process.env.JWT_SECRET;

    if (!secretTokenKey) {
      throw new Error('Please provide a secret token key');
    }

    try {
      this.tokenHandler = JwtTokenHandler.getInstance(secretTokenKey);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

export const authenticationDependencies = new AuthenticationDependencies();
