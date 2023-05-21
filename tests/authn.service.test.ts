import { describe, it, expect, beforeEach } from 'vitest';
import { AuthnService } from '../src/authn/authn.service.js';
import { TokenHandler, MockTokenHandler } from '../src/authn/authn.token.js';
import { Unauthorized } from '../src/errors';

describe('when using a users service', () => {
  let authenticationService: AuthnService;
  let tokenHandler: TokenHandler;

  beforeEach(() => {
    tokenHandler = MockTokenHandler.init().withSecretKey('jxUOag1fPQ');
    authenticationService = new AuthnService({ tokenHandler });
  });

  describe('when creating a token', () => {
    it('should return a string', () => {
      const userId = '422q7';

      const token = authenticationService.createToken(userId);

      expect(typeof token).toBe('string');
    });
  });

  describe('when authenticating a user', () => {
    describe('when the authorization header is missing', () => {
      it('should throw an Unauthorized error', () => {
        const authHeader = undefined;

        expect(() =>
          authenticationService.authenticateUser(authHeader)
        ).toThrow(new Unauthorized('Invalid authorization header'));
      });
    });

    describe("when the authorization header doesn't start with Bearer", () => {
      it('should throw an Unauthorized error', () => {
        const authHeader = 'eyJ1c2VySWQiOiI0MjJxNyJ9.jxUOag1fPQ';

        expect(() =>
          authenticationService.authenticateUser(authHeader)
        ).toThrow(new Unauthorized('Invalid authorization header'));
      });
    });

    describe('when the authorization header is in the correct format', () => {
      describe('and the token is invalid', () => {
        it('should throw an Unauthorized error', () => {
          const authHeader = 'Bearer eyJ1c2VySWQiOiI0MjJxNyJ9';

          expect(() =>
            authenticationService.authenticateUser(authHeader)
          ).toThrow(new Unauthorized('Invalid payload'));
        });
      });

      describe('and the token is valid', () => {
        it('should return the user id', () => {
          const userId = '422q7';
          const authHeader = 'Bearer eyJ1c2VySWQiOiI0MjJxNyJ9.jxUOag1fPQ';

          const decodedUserId =
            authenticationService.authenticateUser(authHeader);

          expect(decodedUserId).toBe(userId);
        });
      });
    });
  });
});
