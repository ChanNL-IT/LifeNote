import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, displayName: dto.displayName },
    });

    return { user: this.sanitizeUser(user), ...(await this.generateTokens(user.id, user.email)) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = verifyPassword(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { user: this.sanitizeUser(user), ...(await this.generateTokens(user.id, user.email)) };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'change_me_refresh_secret',
      });
      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') ?? 'change_me_access_secret',
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'change_me_refresh_secret',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d',
      },
    );

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: { id: string; email: string; displayName: string | null; avatarUrl: string | null }) {
    return { id: user.id, email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl };
  }
}
