import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateNoteDto {
  @ApiProperty({ example: "First Note" })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({ example: "# Hello LifeNote" })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: "markdown" })
  @IsOptional()
  @IsString()
  contentFormat?: "markdown" | "plain_text";

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiPropertyOptional({ example: "blue" })
  @IsOptional()
  @IsString()
  color?: string;
}
