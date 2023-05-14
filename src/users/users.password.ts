export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(
    candidatePassword: string,
    password: string
  ): Promise<boolean>;
}
