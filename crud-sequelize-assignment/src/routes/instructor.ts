import express from 'express';

import instructorController from '../controller/instructor'

const router = express.Router();

router.get('/', instructorController.getCourses);

router.get('/add-course', instructorController.renderAddCourse);

router.post('/add-course', instructorController.addCourse);

router.get('/edit-course/:courseId', instructorController.renderEditCourse);

router.post('/edit-course', instructorController.editCourse);

router.post('/delete-course/:courseId', instructorController.deleteCourse);

export default router;