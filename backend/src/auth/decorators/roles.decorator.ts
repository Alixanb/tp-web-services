import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enum/role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
