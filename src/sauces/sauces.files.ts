import { unlink, readdir } from 'fs/promises';
import { isFileNotFoundError } from '../errors';

export interface FileHandler {
  readFiles(path: string): Promise<string[]>;
  deleteFile(filePath: string): Promise<void>;
}

export class MockFileHandler implements FileHandler {
  private constructor(private files: Record<string, string[]>) {}

  static init(): MockFileHandler {
    return new MockFileHandler({});
  }

  withFiles(filePaths: string[]): MockFileHandler {
    for (const filePath of filePaths) {
      const [dir, file] = filePath.split('/');

      this.files[dir] = [...(this.files[dir] || []), file];
    }

    return this;
  }

  withException(): MockFileHandler {
    this.deleteFile = async (filePath: string): Promise<void> => {
      throw new Error(`Failed to delete file ${filePath}`);
    };

    return this;
  }

  async readFiles(path: string): Promise<string[]> {
    return this.files[path];
  }

  async deleteFile(filePath: string): Promise<void> {
    const [dir, file] = filePath.split('/');

    this.files[dir] = this.files[dir].filter((filename) => filename !== file);
  }
}

class FsFileHandler implements FileHandler {
  async readFiles(path: string): Promise<string[]> {
    return readdir(path);
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return;
      }

      throw error;
    }
  }
}

export const fsFileHandler = new FsFileHandler();
