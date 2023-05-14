import bcrypt from 'bcrypt';

export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(
    candidatePassword: string,
    password: string
  ): Promise<boolean>;
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
