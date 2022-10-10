import { IsString } from 'class-validator';

export class CreateChannelDto {
  
  @IsString()
  public name: string;

}
