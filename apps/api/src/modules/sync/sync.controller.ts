import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  @Get('pull')
  pull() {
    return { success: true, data: { serverTime: new Date().toISOString(), changes: [] } };
  }

  @Post('push')
  push() {
    return { success: true, data: { serverTime: new Date().toISOString(), accepted: [], conflicts: [] } };
  }
}
