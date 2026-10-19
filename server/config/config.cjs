// Sequelize CLI configuration.
//
// Reads the SAME environment variables the app uses (see src/config/database.ts)
// so migrations always run against the exact database your server connects to.
// Using .cjs (not .js) is required because package.json has "type": "module".
require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
};

module.exports = {
  development: base,
  test: { ...base, database: process.env.DB_NAME_TEST || base.database },
  production: base,
};
