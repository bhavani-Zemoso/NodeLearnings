import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import sequelize from '../utils/database';
import Instructor from './instructor';

class Course extends Model<
	InferAttributes<Course>,
	InferCreationAttributes<Course>
> {
	declare id: CreationOptional<number>;

	declare name: string;
    declare image: string;
	declare duration: number;
	declare price: number;
	declare rating: number;

	declare instructorId: ForeignKey<Instructor['id']>;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Course.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: new DataTypes.STRING(256),
			allowNull: false,
		},
        image: {
            type: new DataTypes.STRING(256),
            allowNull: false,
        },
		duration: {
			type: DataTypes.FLOAT.UNSIGNED,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT.UNSIGNED,
			allowNull: false,
		},
		rating: {
			type: DataTypes.FLOAT.UNSIGNED,
			allowNull: false,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		tableName: 'courses',
		sequelize,
	}
);

export default Course;
