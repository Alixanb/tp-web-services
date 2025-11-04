import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from 'src/entities/venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    const venue = this.venueRepository.create(createVenueDto);
    return this.venueRepository.save(venue);
  }

  async findAll(): Promise<Venue[]> {
    return this.venueRepository.find();
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const venue = await this.findOne(id);
    Object.assign(venue, updateVenueDto);
    return this.venueRepository.save(venue);
  }

  async remove(id: string): Promise<void> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ['events'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.events && venue.events.length > 0) {
      throw new BadRequestException(
        'Cannot delete venue with associated events',
      );
    }

    await this.venueRepository.remove(venue);
  }
}
