"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class Instructor extends sequelize_1.Model {
}
Instructor.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, {
    tableName: 'instructors',
    sequelize: database_1.default
});
exports.default = Instructor;
//# sourceMappingURL=instructor.js.map