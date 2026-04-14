import { MatchResult, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.player.deleteMany();
  await prisma.upcomingMatch.deleteMany();
  await prisma.result.deleteMany();
  await prisma.news.deleteMany();

  await prisma.player.createMany({
    data: [
      { dorsal: 1, name: 'Lucas Pol', nick: 'Sheriff', badges: 'Capitán||MVP' },
      { dorsal: 7, name: 'Martín Díaz', nick: 'Turbo', badges: 'Goleador' },
      { dorsal: 10, name: 'Nico Ramos', nick: 'Mago', badges: 'Asistidor' },
    ],
  });

  await prisma.upcomingMatch.createMany({
    data: [
      {
        rival: 'Atlético Barrio Norte',
        date: new Date('2026-04-20T18:00:00.000Z'),
        location: 'Cancha Municipal 3',
        tournament: 'Liga Amateur A',
      },
      {
        rival: 'Deportivo La Estación',
        date: new Date('2026-04-27T16:30:00.000Z'),
        location: 'Predio Lucaspol',
        tournament: 'Copa de Otoño',
      },
    ],
  });

  await prisma.result.createMany({
    data: [
      {
        rival: 'Club Unión Verde',
        date: new Date('2026-04-13T20:00:00.000Z'),
        score: '3 - 1',
        resultType: MatchResult.VICTORIA,
      },
      {
        rival: 'Juventud Oeste',
        date: new Date('2026-04-06T19:00:00.000Z'),
        score: '2 - 2',
        resultType: MatchResult.EMPATE,
      },
    ],
  });

  await prisma.news.createMany({
    data: [
      {
        title: 'Gran victoria para seguir arriba',
        date: new Date('2026-04-14T12:00:00.000Z'),
        excerpt: 'El Sheriff de Lucaspol firmó un 3-1 sólido y continúa peleando el campeonato.',
        imageUrl: 'https://images.unsplash.com/photo-1570498839593-e565b39455fc',
      },
      {
        title: 'Se abre la inscripción de socios',
        date: new Date('2026-04-10T12:00:00.000Z'),
        excerpt: 'Ya podés sumarte a la comunidad y recibir beneficios exclusivos del club.',
        imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0',
      },
    ],
  });

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
