import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    return { success: true, data: await this.usersService.getMe(user.sub) };
  }

  @Patch()
  async updateMe(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateMeDto) {
    return { success: true, data: await this.usersService.updateMe(user.sub, dto) };
  }
}
