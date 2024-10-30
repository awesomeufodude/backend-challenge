import { IsString, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;
}
