import { unlink } from 'fs/promises';

export interface FileHandler {
  deleteFile(filename: string): Promise<void>;
}

export class MockFileHandler implements FileHandler {
  private constructor(private files: string[]) {}

  static init(): MockFileHandler {
    return new MockFileHandler([]);
  }

  withFiles(files: string[]): MockFileHandler {
    this.files = files;
    return this;
  }

  getFiles(): string[] {
    return this.files;
  }

  async deleteFile(filename: string): Promise<void> {
    this.files = this.files.filter((file) => file !== filename);
  }
}

class FsFileHandler implements FileHandler {
  async deleteFile(filename: string): Promise<void> {
    await unlink(`images/${filename}`);
  }
}

export const fsFileHandler = new FsFileHandler();
