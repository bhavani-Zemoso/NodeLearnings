import {
	Association,
	CreationOptional,
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize';
import sequelize from '../utils/database';
import Course from './course';

class Instructor extends Model<
	InferAttributes<Instructor, { omit: 'courses' }>,
	InferCreationAttributes<Instructor, { omit: 'courses' }>
> {
	declare id: CreationOptional<number>;
	declare name: string;
    declare email: string;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare getCourses: HasManyGetAssociationsMixin<Course>; // Note the null assertions!
	declare addCourse: HasManyAddAssociationMixin<Course, number>;
	declare addCourses: HasManyAddAssociationsMixin<Course, number>;
	declare setCourses: HasManySetAssociationsMixin<Course, number>;
	declare removeCourse: HasManyRemoveAssociationMixin<Course, number>;
	declare removeCourses: HasManyRemoveAssociationsMixin<Course, number>;
	declare hasCourse: HasManyHasAssociationMixin<Course, number>;
	declare hasCourses: HasManyHasAssociationsMixin<Course, number>;
	declare countCourses: HasManyCountAssociationsMixin;
	declare createCourse: HasManyCreateAssociationMixin<Course, 'instructorId'>;

	declare courses?: NonAttribute<Course[]>;

	declare static associations: {
		courses: Association<Instructor, Course>;
	};
}

Instructor.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
		},
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(256),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
	},
	{
        tableName: 'instructors',
        sequelize
    }
);

export default Instructor;
