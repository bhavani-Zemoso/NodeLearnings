import express, { NextFunction } from 'express';
import Instructor from '../schema/instructor';

const findInstructor = (id: number) => {
	return Instructor.findByPk(id);
};

const addInstructorAsUser = (
	request: express.Request,
	_response: express.Response,
	next: NextFunction
) => {
	findInstructor(1).then((instructor) => {
		request.user = instructor as Instructor;
		next();
	});
};

const getInstructor = (instructor: Instructor | null) => {
	if (!instructor) {
		return Instructor.create({
			name: 'Brandon',
			email: 'brandon.stark@gmail.com',
		});
	}
	return instructor;
};

export default { addInstructorAsUser, findInstructor, getInstructor };
