import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, type: 'avatar' | 'document' | 'video'): Promise<string> {
    // TODO: Implement S3/Cloudinary upload
    return 'https://example.com/file-url';
  }
}

