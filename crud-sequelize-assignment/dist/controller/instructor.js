"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const renderEditCourse = (request, response, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const editMode = request.query.edit;
    console.log(editMode);
    if (!editMode)
        response.redirect('/');
    const courseId = request.params.courseId;
    try {
        const courses = yield request.user.getCourses({ where: { id: courseId } });
        const course = courses[0];
        if (!course)
            return response.redirect('/');
        response.render('instructor/add-course', {
            pageTitle: 'Edit Course',
            editing: editMode,
            course: course,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const editCourse = (request, response, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = request.body.courseId;
    const updatedName = request.body.name;
    const updatedImage = request.body.image;
    const updatedDuration = request.body.duration;
    const updatedRating = request.body.rating;
    const updatedPrice = request.body.price;
    try {
        const course = yield course_1.default.findByPk(courseId);
        course.name = updatedName;
        course.image = updatedImage;
        course.duration = updatedDuration;
        course.rating = updatedRating;
        course.price = updatedPrice;
        yield (course === null || course === void 0 ? void 0 : course.save());
        response.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
});
const deleteCourse = (request, response, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = request.params.courseId;
    try {
        const course = yield course_1.default.findByPk(courseId);
        yield (course === null || course === void 0 ? void 0 : course.destroy());
        response.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = {
    getCourses,
    renderAddCourse,
    addCourse,
    renderEditCourse,
    editCourse,
    deleteCourse,
};
//# sourceMappingURL=instructor.js.map