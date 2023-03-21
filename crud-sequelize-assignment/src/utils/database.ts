import { Sequelize } from "sequelize";

const sequelize = new Sequelize('node_poc_learning_platform', 'root', 'Bhav_6421!', {
    dialect: 'mysql',
    host: 'localhost',
});

export default sequelize;