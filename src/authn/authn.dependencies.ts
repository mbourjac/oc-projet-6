import { JwtTokenHandler, TokenHandler } from './authn.token';

export interface IAuthnDependencies {
  tokenHandler: TokenHandler;
}

class AuthnDependencies implements IAuthnDependencies {
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

export const authnDependencies = new AuthnDependencies();
