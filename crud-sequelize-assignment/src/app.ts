import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import rootDir from './utils/path';

import sequelize from './utils/database';
import Instructor from './schema/instructor';
import Course from './schema/course';
import { get404 } from './controller/error';
import instructorRoutes from './routes/instructor'
import instructorMiddleware from './middleware/add-instructor';

const app = express();
app.use(express.static(path.join(rootDir, '/../public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(instructorMiddleware.addInstructorAsUser);

app.set('view engine', 'pug');
app.set('views', path.join(rootDir, '/../views'));

app.use(instructorRoutes);
app.use(get404);

Instructor.hasMany(Course, {
	sourceKey: 'id',
	foreignKey: 'instructorId',
	as: 'courses',
});

sequelize
	.sync({ alter: true })
	.then((result) => {
		return instructorMiddleware.findInstructor(1);
	})
	.then((user) => {
		return instructorMiddleware.getInstructor(user)
	})
	.then((result) => {
		console.log('Connected to database and running app');
		app.listen(3000);
	})
	.catch((error) => {
		console.log(error);
	});
