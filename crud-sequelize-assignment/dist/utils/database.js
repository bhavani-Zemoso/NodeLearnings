"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('node_poc_learning_platform', 'root', 'Bhav_6421!', {
    dialect: 'mysql',
    host: 'localhost',
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map