import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {
  DATABASE_URL,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_SSL
} = process.env;

const useSsl = String(DB_SSL || '').toLowerCase() === 'true';
const port = DB_PORT ? Number(DB_PORT) : 5432;
const password = DB_PASS ?? DB_PASSWORD ?? '';

let sequelize;

if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  });
  console.log('🔧 Sequelize usando DATABASE_URL (SSL:', useSsl, ')');
} else {
  sequelize = new Sequelize(DB_NAME || 'proyecto', DB_USER || 'postgres', password, {
    host: DB_HOST || 'localhost',
    port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  });
  console.log(`🔧 Sequelize config → host=${DB_HOST || 'localhost'} port=${port} db=${DB_NAME || 'proyecto'} user=${DB_USER || 'postgres'} ssl=${useSsl}`);
}

export { sequelize };

