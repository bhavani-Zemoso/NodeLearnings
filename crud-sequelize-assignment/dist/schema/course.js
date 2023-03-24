"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class Course extends sequelize_1.Model {
}
Course.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    image: {
        type: new sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT.UNSIGNED,
        allowNull: false,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'courses',
    sequelize: database_1.default,
});
exports.default = Course;
//# sourceMappingURL=course.js.map