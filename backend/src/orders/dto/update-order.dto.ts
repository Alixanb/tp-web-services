import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from 'src/common/enum/role.enum';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
