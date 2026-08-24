import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  question: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  answer: string;
}
