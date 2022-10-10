import { IsNumber, IsString } from 'class-validator';

export class AddMessageDto {
  
  @IsString()
  public text: string;

  @IsNumber()
  public channel_id: number;

  @IsString()
  public UUID: string;
}
