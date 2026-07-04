import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AddNoteTagsDto } from "./dto/add-note-tags.dto";
import { CreateNoteDto } from "./dto/create-note.dto";
import { NotesQueryDto } from "./dto/notes-query.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NotesService } from "./notes.service";

@ApiTags("Notes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: NotesQueryDto,
  ) {
    return {
      success: true,
      data: await this.notesService.findAll(user.sub, query),
    };
  }

  @Get(":id")
  async findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
  ) {
    return {
      success: true,
      data: await this.notesService.findOne(user.sub, id),
    };
  }

  @Post()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateNoteDto,
  ) {
    return {
      success: true,
      data: await this.notesService.create(user.sub, dto),
    };
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return {
      success: true,
      data: await this.notesService.update(user.sub, id, dto),
    };
  }

  @Delete(":id")
  async remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
  ) {
    return { success: true, ...(await this.notesService.remove(user.sub, id)) };
  }

  @Post(":id/restore")
  async restore(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
  ) {
    return {
      success: true,
      ...(await this.notesService.restore(user.sub, id)),
    };
  }

  @Post(":id/tags")
  async addTags(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Body() dto: AddNoteTagsDto,
  ) {
    return {
      success: true,
      data: await this.notesService.addTags(user.sub, id, dto.tagIds),
      message: "Tags added successfully",
    };
  }

  @Delete(":id/tags/:tagId")
  async removeTag(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Param("tagId") tagId: string,
  ) {
    return {
      success: true,
      data: await this.notesService.removeTag(user.sub, id, tagId),
      message: "Tag removed successfully",
    };
  }
}
