import { unlink } from 'fs/promises';

export interface FileHandler {
  deleteFile(filename: string): Promise<void>;
}

class FsFileHandler implements FileHandler {
  async deleteFile(filename: string): Promise<void> {
    await unlink(`images/${filename}`);
  }
}

export const fsFileHandler = new FsFileHandler();
