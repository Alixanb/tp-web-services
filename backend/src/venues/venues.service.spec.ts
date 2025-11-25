import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Venue } from 'src/entities/venue.entity';
import { VenuesService } from './venues.service';

describe('VenuesService', () => {
  let service: VenuesService;

  const venueRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const venue: Venue = {
    id: 'venue-1',
    name: 'Arena',
    address: '1 street',
    postalCode: '75000',
    country: 'France',
    capacity: 1000,
    city: 'Paris',
    description: undefined,
    events: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenuesService,
        {
          provide: getRepositoryToken(Venue),
          useValue: venueRepository,
        },
      ],
    }).compile();

    service = module.get<VenuesService>(VenuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create persiste un nouveau lieu', async () => {
    venueRepository.create.mockReturnValue(venue);
    venueRepository.save.mockResolvedValue(venue);

    const result = await service.create({
      name: 'Arena',
      address: '1 street',
      capacity: 1000,
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
    });

    expect(venueRepository.create).toHaveBeenCalled();
    expect(venueRepository.save).toHaveBeenCalledWith(venue);
    expect(result).toEqual(venue);
  });

  it('findOne renvoie NotFound si le lieu manque', async () => {
    venueRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove interdit la suppression si évènements liés', async () => {
    venueRepository.findOne.mockResolvedValue({ ...venue, events: [{} as any] });

    await expect(service.remove('venue-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('remove supprime lorsque aucun évènement', async () => {
    venueRepository.findOne.mockResolvedValue({ ...venue, events: [] });
    venueRepository.remove.mockResolvedValue(undefined);

    await service.remove('venue-1');

    expect(venueRepository.remove).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'venue-1' }),
    );
  });
});
