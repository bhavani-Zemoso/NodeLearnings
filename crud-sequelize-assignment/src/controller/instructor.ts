import express, { NextFunction } from 'express';
import Course from '../schema/course';
declare const pug: any;

const getCourses = (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	request.user
		.getCourses()
		.then((courses: any) => {
			response.render('instructor/courses', {
				courses: courses,
				pageTitle: 'Instructor Courses',
				path: '/instructor/',
			});
		})
		.catch((error: Error) => console.log(error));
};

const renderAddCourse = (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	response.render('instructor/add-course', {
		pageTitle: 'Add Course',
		path: '/instructor/add-course',
	});
};

const addCourse = (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const name = request.body.name;
	const image = request.body.image;
	const duration = request.body.duration;
	const rating = request.body.rating;
	const price = request.body.price;
	request.user
		.createCourse({
			name: name,
			image: image,
			duration: duration,
			rating: rating,
			price: price,
			instructorId: request.user.id,
		})
		.then((_result: any) => {
			response.redirect('/');
		})
		.catch((error: Error) => console.log(error));
};

const renderEditCourse = (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const editMode = request.query.edit;
	console.log(editMode);
	if (!editMode) response.redirect('/');
	const courseId = request.params.courseId;
	request.user
		.getCourses({ where: { id: courseId } })
		.then((courses: any) => {
			const course = courses[0];
			if (!course) return response.redirect('/');
			response.render('instructor/add-course', {
				pageTitle: 'Edit Course',
				editing: editMode,
				course: course,
			});
		})
		.catch((error: Error) => console.log(error));
};

const editCourse = (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const courseId = request.body.courseId;
	const updatedName = request.body.name;
	const updatedImage = request.body.image;
	const updatedDuration = request.body.duration;
	const updatedRating = request.body.rating;
	const updatedPrice = request.body.price;
	Course.findByPk(courseId)
		.then((course: any) => {
			console.log('Course Image: ', course.image, 'Course name: ', course.name);
			course.name = updatedName;
			course.image = updatedImage;
			course.duration = updatedDuration;
			course.rating = updatedRating;
			course.price = updatedPrice;
			return course.save();
		})
		.then((result) => {
			response.redirect('/');
		})
		.catch((error: Error) => console.log(error));
};

const deleteCourse = (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const courseId = request.params.courseId;
	Course.findByPk(courseId)
		.then((course: any) => {
			return course.destroy();
		})
		.then((result) => {
			response.redirect('/');
		})
		.catch((error: Error) => {
			console.log(error);
		});
};

export default {
	getCourses,
	renderAddCourse,
	addCourse,
	renderEditCourse,
	editCourse,
	deleteCourse,
};
