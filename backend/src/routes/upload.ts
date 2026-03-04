import { Router, Response } from 'express';
import upload from '../middleware/upload';
import cloudinary from '../config/cloudinary';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { Readable } from 'stream';

const router = Router();

router.post(
  '/banner',
  authenticate,
  requireAdmin,
  upload.single('banner'),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
      const url = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'eventbooking/banners', transformation: [{ width: 1280, crop: 'limit' }, { quality: 'auto' }] },
          (err, result) => {
            if (err || !result) return reject(err);
            resolve(result.secure_url);
          }
        );
        Readable.from(req.file!.buffer).pipe(stream);
      });

      res.json({ url });
    } catch (e: any) {
      res.status(500).json({ message: 'Upload failed', error: e.message });
    }
  }
);

export default router;
