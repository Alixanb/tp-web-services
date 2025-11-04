import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Venue } from '../entities/venue.entity';
import { Category } from '../entities/category.entity';
import { Event } from '../entities/event.entity';
import { TicketCategory } from '../entities/ticket-category.entity';
import { UserRole, EventStatus } from '../common/enum/role.enum';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Starting database seeding...');

  const userRepository = dataSource.getRepository(User);
  const venueRepository = dataSource.getRepository(Venue);
  const categoryRepository = dataSource.getRepository(Category);
  const eventRepository = dataSource.getRepository(Event);
  const ticketCategoryRepository = dataSource.getRepository(TicketCategory);

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  await userRepository.save({
    email: 'admin@eventpass.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'EventPass',
    role: UserRole.ADMIN,
    phoneNumber: '+33612345678',
  });

  const organizer1 = await userRepository.save({
    email: 'organizer1@eventpass.com',
    password: hashedPassword,
    firstName: 'Marie',
    lastName: 'Dupont',
    role: UserRole.ORGANIZER,
    phoneNumber: '+33623456789',
  });

  const organizer2 = await userRepository.save({
    email: 'organizer2@eventpass.com',
    password: hashedPassword,
    firstName: 'Pierre',
    lastName: 'Martin',
    role: UserRole.ORGANIZER,
    phoneNumber: '+33634567890',
  });

  await userRepository.save({
    email: 'client1@example.com',
    password: hashedPassword,
    firstName: 'Sophie',
    lastName: 'Bernard',
    role: UserRole.CLIENT,
    phoneNumber: '+33645678901',
  });

  await userRepository.save({
    email: 'client2@example.com',
    password: hashedPassword,
    firstName: 'Thomas',
    lastName: 'Petit',
    role: UserRole.CLIENT,
  });

  console.log('✓ Users created');

  // Create Categories
  console.log('Creating categories...');
  const categories = await categoryRepository.save([
    {
      name: 'Musique',
      description: 'Concerts, festivals et événements musicaux',
      icon: 'music',
    },
    {
      name: 'Sport',
      description: 'Événements sportifs et compétitions',
      icon: 'sports',
    },
    {
      name: 'Théâtre',
      description: 'Pièces de théâtre et spectacles',
      icon: 'theater',
    },
    {
      name: 'Conférence',
      description: 'Conférences et séminaires professionnels',
      icon: 'business',
    },
    {
      name: 'Festival',
      description: 'Festivals culturels et artistiques',
      icon: 'celebration',
    },
  ]);

  console.log('✓ Categories created');

  // Create Venues
  console.log('Creating venues...');
  const venues = await venueRepository.save([
    {
      name: 'Zénith de Paris',
      address: '211 Avenue Jean Jaurès',
      city: 'Paris',
      postalCode: '75019',
      country: 'France',
      capacity: 6293,
      description: 'Grande salle de spectacle parisienne',
    },
    {
      name: 'AccorHotels Arena',
      address: '8 Boulevard de Bercy',
      city: 'Paris',
      postalCode: '75012',
      country: 'France',
      capacity: 20300,
      description: 'La plus grande salle couverte de France',
    },
    {
      name: 'Stade de France',
      address: '93200 Saint-Denis',
      city: 'Saint-Denis',
      postalCode: '93200',
      country: 'France',
      capacity: 80698,
      description: 'Le plus grand stade de France',
    },
    {
      name: 'Olympia',
      address: '28 Boulevard des Capucines',
      city: 'Paris',
      postalCode: '75009',
      country: 'France',
      capacity: 2000,
      description: 'Salle mythique parisienne',
    },
    {
      name: 'Parc des Princes',
      address: '24 Rue du Commandant Guilbaud',
      city: 'Paris',
      postalCode: '75016',
      country: 'France',
      capacity: 47929,
      description: 'Stade mythique du Paris Saint-Germain',
    },
    {
      name: 'Théâtre du Châtelet',
      address: '1 Place du Châtelet',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      capacity: 2500,
      description: 'Théâtre musical parisien',
    },
  ]);

  console.log('✓ Venues created');

  // Create Events
  console.log('Creating events...');
  const now = new Date();
  const events = [];

  // Event 1: Concert de Jazz
  const event1 = await eventRepository.save({
    title: 'Festival Jazz en Seine',
    description:
      'Le plus grand festival de jazz gratuit en France. Trois jours de concerts exceptionnels avec les plus grands noms du jazz international.',
    startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    venueId: venues[0].id,
    categoryId: categories[0].id,
    organizerId: organizer1.id,
  });
  events.push(event1);

  await ticketCategoryRepository.save([
    {
      eventId: event1.id,
      name: 'Pass 3 jours VIP',
      price: 89.99,
      totalStock: 100,
      availableStock: 100,
      description: 'Accès privilégié aux 3 jours avec loges VIP',
    },
    {
      eventId: event1.id,
      name: 'Pass 3 jours Standard',
      price: 49.99,
      totalStock: 500,
      availableStock: 500,
      description: 'Accès complet aux 3 jours',
    },
    {
      eventId: event1.id,
      name: 'Pass journée',
      price: 19.99,
      totalStock: 1000,
      availableStock: 1000,
      description: 'Accès pour une journée',
    },
  ]);

  // Event 2: Match de Football
  const event2 = await eventRepository.save({
    title: 'PSG vs Olympique de Marseille',
    description:
      "Le Classico! Ne manquez pas le match le plus attendu de la saison entre le PSG et l'OM au Parc des Princes.",
    startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
    endDate: new Date(
      now.getTime() + 15 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    ),
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
    venueId: venues[4].id,
    categoryId: categories[1].id,
    organizerId: organizer2.id,
  });
  events.push(event2);

  await ticketCategoryRepository.save([
    {
      eventId: event2.id,
      name: 'Tribune Présidentielle',
      price: 250.0,
      totalStock: 200,
      availableStock: 200,
      description: 'La meilleure vue du stade',
    },
    {
      eventId: event2.id,
      name: 'Tribune Auteuil',
      price: 120.0,
      totalStock: 5000,
      availableStock: 5000,
      description: 'Tribune des supporters parisiens',
    },
    {
      eventId: event2.id,
      name: 'Virage',
      price: 80.0,
      totalStock: 10000,
      availableStock: 10000,
      description: 'Places debout dans les virages',
    },
  ]);

  // Event 3: Concert Rock
  const event3 = await eventRepository.save({
    title: 'Rock Legends Tour',
    description:
      "Les plus grandes légendes du rock réunies pour un concert exceptionnel à l'AccorHotels Arena.",
    startDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
    endDate: new Date(
      now.getTime() + 45 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
    ),
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    venueId: venues[1].id,
    categoryId: categories[0].id,
    organizerId: organizer1.id,
  });
  events.push(event3);

  await ticketCategoryRepository.save([
    {
      eventId: event3.id,
      name: 'Fosse',
      price: 99.0,
      totalStock: 2000,
      availableStock: 2000,
      description: 'Au plus près de la scène',
    },
    {
      eventId: event3.id,
      name: 'Gradin',
      price: 59.0,
      totalStock: 10000,
      availableStock: 10000,
      description: 'Places assises en gradin',
    },
  ]);

  // Event 4: Comédie Musicale
  const event4 = await eventRepository.save({
    title: 'Le Roi Lion - Comédie Musicale',
    description:
      'La comédie musicale phénomène revient au Théâtre du Châtelet pour une série limitée de représentations.',
    startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(
      now.getTime() + 20 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
    ),
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    venueId: venues[5].id,
    categoryId: categories[2].id,
    organizerId: organizer2.id,
  });
  events.push(event4);

  await ticketCategoryRepository.save([
    {
      eventId: event4.id,
      name: 'Orchestre',
      price: 150.0,
      totalStock: 400,
      availableStock: 400,
      description: "Places au niveau de l'orchestre",
    },
    {
      eventId: event4.id,
      name: 'Mezzanine',
      price: 95.0,
      totalStock: 800,
      availableStock: 800,
      description: 'Places en mezzanine',
    },
    {
      eventId: event4.id,
      name: 'Balcon',
      price: 60.0,
      totalStock: 1300,
      availableStock: 1300,
      description: 'Places au balcon',
    },
  ]);

  // Event 5: Festival Électro
  const event5 = await eventRepository.save({
    title: 'Electronic Paradise Festival',
    description:
      'Le plus grand festival de musique électronique de France avec plus de 50 artistes internationaux.',
    startDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 62 * 24 * 60 * 60 * 1000),
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
    venueId: venues[2].id,
    categoryId: categories[4].id,
    organizerId: organizer1.id,
  });
  events.push(event5);

  await ticketCategoryRepository.save([
    {
      eventId: event5.id,
      name: 'Pass Platinum',
      price: 299.0,
      totalStock: 500,
      availableStock: 500,
      description: 'Accès illimité + backstage + cadeaux exclusifs',
    },
    {
      eventId: event5.id,
      name: 'Pass Gold',
      price: 189.0,
      totalStock: 2000,
      availableStock: 2000,
      description: 'Accès complet aux 3 jours + zone VIP',
    },
    {
      eventId: event5.id,
      name: 'Pass Standard',
      price: 89.0,
      totalStock: 40000,
      availableStock: 40000,
      description: 'Accès standard aux 3 jours',
    },
  ]);

  // Event 6: Conférence Tech
  const event6 = await eventRepository.save({
    title: 'Tech Summit Paris 2025',
    description:
      "La plus grande conférence tech de France. Trois jours de conférences, workshops et networking avec les leaders de l'industrie.",
    startDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000),
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    venueId: venues[1].id,
    categoryId: categories[3].id,
    organizerId: organizer2.id,
  });
  events.push(event6);

  await ticketCategoryRepository.save([
    {
      eventId: event6.id,
      name: 'All Access Pass',
      price: 599.0,
      totalStock: 100,
      availableStock: 100,
      description: 'Accès à toutes les conférences + workshops + dîner VIP',
    },
    {
      eventId: event6.id,
      name: 'Conference Pass',
      price: 299.0,
      totalStock: 500,
      availableStock: 500,
      description: 'Accès aux conférences principales',
    },
    {
      eventId: event6.id,
      name: 'Day Pass',
      price: 129.0,
      totalStock: 1000,
      availableStock: 1000,
      description: 'Accès pour une journée',
    },
  ]);

  console.log('✓ Events created');

  console.log('');
  console.log('✅ Database seeding completed!');
  console.log('');
  console.log('📧 Test accounts created:');
  console.log('Admin: admin@eventpass.com / password123');
  console.log('Organizer 1: organizer1@eventpass.com / password123');
  console.log('Organizer 2: organizer2@eventpass.com / password123');
  console.log('Client 1: client1@example.com / password123');
  console.log('Client 2: client2@example.com / password123');
}
