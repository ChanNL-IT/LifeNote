import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: { userId, deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            noteTags: {
              where: {
                note: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      notesCount: tag._count.noteTags,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));
  }

  async create(userId: string, dto: CreateTagDto) {
    const slug = slugify(dto.name);
    const existing = await this.prisma.tag.findFirst({
      where: { userId, slug, deletedAt: null },
    });
    if (existing) throw new ConflictException("Tag already exists");
    return this.prisma.tag.create({
      data: { userId, name: dto.name, slug, color: dto.color },
    });
  }

  async update(userId: string, id: string, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!tag) throw new NotFoundException("Tag not found");

    const slug = dto.name ? slugify(dto.name) : undefined;
    if (slug && slug !== tag.slug) {
      const existing = await this.prisma.tag.findFirst({
        where: { userId, slug, deletedAt: null },
      });
      if (existing) throw new ConflictException("Tag already exists");
    }

    return this.prisma.tag.update({ where: { id }, data: { ...dto, slug } });
  }

  async remove(userId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!tag) throw new NotFoundException("Tag not found");
    await this.prisma.tag.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: "Tag deleted successfully" };
  }
}
