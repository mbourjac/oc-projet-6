import bcrypt from 'bcrypt';

export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(
    candidatePassword: string,
    password: string
  ): Promise<boolean>;
}

export class MockPasswordHasher implements PasswordHasher {
  private constructor(private hash: string) {}

  static init(): MockPasswordHasher {
    return new MockPasswordHasher('');
  }

  withHash(hash: string): MockPasswordHasher {
    this.hash = hash;
    return this;
  }

  async hashPassword(password: string): Promise<string> {
    return `${this.hash}${password}`;
  }

  async comparePassword(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return `${this.hash}${candidatePassword}` === hashedPassword;
  }
}

class BcryptPasswordHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    candidatePassword: string,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, password);
  }
}

export const bcryptPasswordHasher = new BcryptPasswordHasher();
