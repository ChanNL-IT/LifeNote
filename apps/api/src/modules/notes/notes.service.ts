import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { NotesQueryDto } from "./dto/notes-query.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: NotesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const keyword = query.q?.trim();

    const where = {
      userId,
      deletedAt: null,
      ...(typeof query.favorite === "boolean"
        ? { isFavorite: query.favorite }
        : {}),
      ...(typeof query.archived === "boolean"
        ? { isArchived: query.archived }
        : {}),
      ...(query.tagId
        ? {
            noteTags: {
              some: {
                tag: {
                  id: query.tagId,
                  userId,
                  deletedAt: null,
                },
              },
            },
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: "insensitive" as const } },
              { content: { contains: keyword, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const orderBy = this.getOrderBy(query.sort);

    const [items, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { noteTags: { include: { tag: true } } },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      items: items.map((note) => this.mapNote(note)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
      include: { noteTags: { include: { tag: true } } },
    });
    if (!note) throw new NotFoundException("Note not found");
    return this.mapNote(note);
  }

  async create(userId: string, dto: CreateNoteDto) {
    const tagIds = this.uniqueIds(dto.tagIds);
    await this.ensureTagsOwner(userId, tagIds);

    const note = await this.prisma.note.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content ?? "",
        contentFormat: dto.contentFormat ?? "markdown",
        color: dto.color,
        noteTags: tagIds.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: { noteTags: { include: { tag: true } } },
    });
    return this.mapNote(note);
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    await this.ensureOwner(userId, id);
    const note = await this.prisma.note.update({
      where: { id },
      data: dto,
      include: { noteTags: { include: { tag: true } } },
    });
    return this.mapNote(note);
  }

  async remove(userId: string, id: string) {
    await this.ensureOwner(userId, id);
    await this.prisma.note.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: "Note deleted successfully" };
  }

  async restore(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({ where: { id, userId } });
    if (!note) throw new NotFoundException("Note not found");
    await this.prisma.note.update({ where: { id }, data: { deletedAt: null } });
    return { message: "Note restored successfully" };
  }

  async addTags(userId: string, id: string, tagIds: string[]) {
    await this.ensureOwner(userId, id);
    const uniqueTagIds = this.uniqueIds(tagIds);
    await this.ensureTagsOwner(userId, uniqueTagIds);

    await this.prisma.noteTag.createMany({
      data: uniqueTagIds.map((tagId) => ({ noteId: id, tagId })),
      skipDuplicates: true,
    });

    return this.findOne(userId, id);
  }

  async removeTag(userId: string, id: string, tagId: string) {
    await this.ensureOwner(userId, id);
    await this.ensureTagsOwner(userId, [tagId]);

    await this.prisma.noteTag.deleteMany({
      where: {
        noteId: id,
        tagId,
      },
    });

    return this.findOne(userId, id);
  }

  private async ensureOwner(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.deletedAt) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new ForbiddenException("Forbidden");
  }

  private async ensureTagsOwner(userId: string, tagIds: string[]) {
    if (!tagIds.length) return;

    const count = await this.prisma.tag.count({
      where: {
        id: { in: tagIds },
        userId,
        deletedAt: null,
      },
    });

    if (count !== tagIds.length) {
      throw new NotFoundException("One or more tags not found");
    }
  }

  private uniqueIds(ids?: string[]) {
    return [...new Set(ids ?? [])];
  }

  private getOrderBy(sort: NotesQueryDto["sort"]) {
    if (sort === "createdAt_desc") {
      return [{ isPinned: "desc" as const }, { createdAt: "desc" as const }];
    }

    if (sort === "title_asc") {
      return [{ isPinned: "desc" as const }, { title: "asc" as const }];
    }

    return [{ isPinned: "desc" as const }, { updatedAt: "desc" as const }];
  }

  private mapNote(note: any) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      contentFormat: note.contentFormat,
      isFavorite: note.isFavorite,
      isPinned: note.isPinned,
      isArchived: note.isArchived,
      color: note.color,
      tags:
        note.noteTags
          ?.filter((nt: any) => !nt.tag.deletedAt)
          .map((nt: any) => this.mapTag(nt.tag)) ?? [],
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  private mapTag(tag: any) {
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
    };
  }
}
