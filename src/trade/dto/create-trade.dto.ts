import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTradeDto {
    @IsInt()
    @IsNotEmpty()
  survivorId1: number;

  @IsInt()
  @IsNotEmpty()
  survivorId2: number;

  @IsInt()
  @IsNotEmpty()
  itemId1: number;

  @IsInt()
  @IsNotEmpty()
  itemId2: number;

  @IsInt()
  @IsNotEmpty()
  quantity1: number;

  @IsInt()
  @IsNotEmpty()
  quantity2: number;
}
