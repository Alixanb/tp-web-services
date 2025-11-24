import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(action: string, userId: string, ipAddress: string, details?: string) {
    const log = this.auditLogRepository.create({
      action,
      userId,
      ipAddress,
      details,
    });
    await this.auditLogRepository.save(log);
  }
}
