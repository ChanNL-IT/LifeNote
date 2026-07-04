import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AddNoteTagsDto {
  @ApiProperty({
    type: [String],
    example: ["b8dc47ca-83c4-4bb8-a7fb-5a1f64866d7b"],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  tagIds!: string[];
}
