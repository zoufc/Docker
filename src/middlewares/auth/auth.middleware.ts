import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/api/auth/auth.service';
import { sanitizeUser } from 'src/utils/functions';
import { logger } from 'src/utils/logger/logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: any, next: () => void) {
    try {
      logger.info(`---MIDDLEWARE STAGE INIT---`);
      const token = req.headers['x-access-token'];
      if (!token) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const verifyToken = await this.authService.verifyToken(token);
      const user = await this.authService.findByEmail(verifyToken.email);
      const sanitizedUser = await sanitizeUser(user);
      req['user'] = sanitizedUser;
      next();
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json(error);
    }
  }
}
