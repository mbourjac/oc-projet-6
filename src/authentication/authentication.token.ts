export interface TokenHandler {
  createToken(identifier: string): string;
  getPayload(token: string): unknown;
}
