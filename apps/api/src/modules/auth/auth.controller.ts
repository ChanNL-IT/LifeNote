import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return { success: true, data: await this.authService.register(dto) };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return { success: true, data: await this.authService.login(dto) };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return { success: true, data: await this.authService.refresh(dto.refreshToken) };
  }

  @Post('logout')
  logout() {
    return { success: true, message: 'Logged out successfully' };
  }
}
