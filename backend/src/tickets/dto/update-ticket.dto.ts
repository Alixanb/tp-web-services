import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from 'src/common/enum/role.enum';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  seatNumber?: string;
}
