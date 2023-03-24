import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

const {DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST} = process.env

const sequelize = new Sequelize(DB_DATABASE as string, DB_USERNAME as string, DB_PASSWORD as string, {
    dialect: 'mysql',
    host: DB_HOST,
});

export default sequelize;