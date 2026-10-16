import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DeviceIdMiddleware implements NestMiddleware {
  private readonly COOKIE_NAME = 'device_id';
  private readonly HEADER_NAME = 'x-device-id';
  private readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    path: '/',
  };

  use(req: Request, res: Response, next: NextFunction) {
    // Priority: header (from frontend) > cookie (from previous requests)
    let deviceId = req.headers[this.HEADER_NAME] as string || req.cookies?.[this.COOKIE_NAME];

    if (!deviceId) {
      deviceId = this.generateDeviceId();
    }

    // Always set/update cookie for future requests
    res.cookie(this.COOKIE_NAME, deviceId, this.COOKIE_OPTIONS);

    // Attach to request for easy access
    (req as any).deviceId = deviceId;
    next();
  }

  private generateDeviceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}