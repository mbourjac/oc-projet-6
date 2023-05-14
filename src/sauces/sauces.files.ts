export interface FileHandler {
  deleteFile(filename: string): Promise<void>;
}
