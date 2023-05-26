import { getConfig } from '../config/config';
import { JwtTokenHandler, TokenHandler } from './authn.token';

export interface IAuthnDependencies {
  tokenHandler: TokenHandler;
}

class AuthnDependencies implements IAuthnDependencies {
  readonly tokenHandler: TokenHandler;

  constructor() {
    const { secretTokenKey } = getConfig();

    this.tokenHandler = JwtTokenHandler.getInstance(secretTokenKey);
  }
}

export const authnDependencies = new AuthnDependencies();
