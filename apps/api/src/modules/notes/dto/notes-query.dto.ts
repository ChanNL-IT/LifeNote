import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class NotesQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: "flutter" })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: "uuid" })
  @IsOptional()
  @IsUUID()
  tagId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  favorite?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  archived?: boolean;

  @ApiPropertyOptional({
    enum: ["updatedAt_desc", "createdAt_desc", "title_asc"],
    default: "updatedAt_desc",
  })
  @IsOptional()
  @IsIn(["updatedAt_desc", "createdAt_desc", "title_asc"])
  sort?: "updatedAt_desc" | "createdAt_desc" | "title_asc" = "updatedAt_desc";
}
