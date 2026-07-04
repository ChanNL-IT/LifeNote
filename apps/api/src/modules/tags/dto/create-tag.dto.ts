import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateTagDto {
  @ApiProperty({ example: "Flutter" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: "blue" })
  @IsOptional()
  @IsString()
  color?: string;
}
