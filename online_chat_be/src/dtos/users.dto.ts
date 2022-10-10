import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public uuid: string;
}
