"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../schema/course"));
const getCourses = (request, response, _next) => {
    request.user
        .getCourses()
        .then((courses) => {
        response.render('instructor/courses', {
            courses: courses,
            pageTitle: 'Instructor Courses',
            path: '/instructor/',
        });
    })
        .catch((error) => console.log(error));
};
const renderAddCourse = (request, response, _next) => {
    response.render('instructor/add-course', {
        pageTitle: 'Add Course',
        path: '/instructor/add-course',
    });
};
const addCourse = (request, response, _next) => {
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
        .then((_result) => {
        response.redirect('/');
    })
        .catch((error) => console.log(error));
};
const renderEditCourse = (request, response, _next) => {
    const editMode = request.query.edit;
    console.log(editMode);
    if (!editMode)
        response.redirect('/');
    const courseId = request.params.courseId;
    request.user
        .getCourses({ where: { id: courseId } })
        .then((courses) => {
        const course = courses[0];
        if (!course)
            return response.redirect('/');
        response.render('instructor/add-course', {
            pageTitle: 'Edit Course',
            editing: editMode,
            course: course,
        });
    })
        .catch((error) => console.log(error));
};
const editCourse = (request, response, _next) => {
    const courseId = request.body.courseId;
    const updatedName = request.body.name;
    const updatedImage = request.body.image;
    const updatedDuration = request.body.duration;
    const updatedRating = request.body.rating;
    const updatedPrice = request.body.price;
    course_1.default.findByPk(courseId)
        .then((course) => {
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
        .catch((error) => console.log(error));
};
const deleteCourse = (request, response, _next) => {
    const courseId = request.params.courseId;
    course_1.default.findByPk(courseId)
        .then((course) => {
        return course.destroy();
    })
        .then((result) => {
        response.redirect('/');
    })
        .catch((error) => {
        console.log(error);
    });
};
exports.default = {
    getCourses,
    renderAddCourse,
    addCourse,
    renderEditCourse,
    editCourse,
    deleteCourse,
};
//# sourceMappingURL=instructor.js.map