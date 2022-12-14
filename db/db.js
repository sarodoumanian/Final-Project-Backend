import dottenv from 'dotenv';
import { Sequelize } from 'sequelize';
dottenv.config();

const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;
const dialect = 'mysql';

export default new Sequelize(dbName, user, password, {
  host: 'localhost',
  dialect,
  logging: false
});
