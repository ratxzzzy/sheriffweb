import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Falta variable de entorno obligatoria: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  adminUsername: process.env.ADMIN_USERNAME as string,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH as string,
};
