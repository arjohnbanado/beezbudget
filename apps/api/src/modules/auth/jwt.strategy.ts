import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const publicKeyBase64 = configService.getOrThrow<string>('PUBLIC_KEY');
    const publicKey = Buffer.from(publicKeyBase64, 'base64').toString('ascii');

    // 1. Define the custom cookie extractor
    const cookieExtractor = (req: Request) => {
      return req.cookies['__Host-access_token'] || null;
    };

    super({
      // 2. Pass an array of extractors
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor, // Tries the cookie first
        ExtractJwt.fromAuthHeaderAsBearerToken(), // If no cookie, tries the Bearer header
      ]),
      ignoreExpiration: false,
      secretOrKey: publicKey,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      isOnboarded: Boolean(payload.isOnboarded),
    };
  }
}
