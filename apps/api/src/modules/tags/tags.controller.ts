import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagsService } from "./tags.service";

@ApiTags("Tags")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    return { success: true, data: await this.tagsService.findAll(user.sub) };
  }

  @Post()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateTagDto,
  ) {
    return {
      success: true,
      data: await this.tagsService.create(user.sub, dto),
    };
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return {
      success: true,
      data: await this.tagsService.update(user.sub, id, dto),
    };
  }

  @Delete(":id")
  async remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
  ) {
    return { success: true, ...(await this.tagsService.remove(user.sub, id)) };
  }
}
