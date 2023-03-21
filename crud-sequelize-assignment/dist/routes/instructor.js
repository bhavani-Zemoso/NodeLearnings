"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instructor_1 = __importDefault(require("../controller/instructor"));
const router = express_1.default.Router();
router.get('/', instructor_1.default.getCourses);
router.get('/add-course', instructor_1.default.renderAddCourse);
router.post('/add-course', instructor_1.default.addCourse);
router.get('/edit-course/:courseId', instructor_1.default.renderEditCourse);
router.post('/edit-course', instructor_1.default.editCourse);
router.post('/delete-course/:courseId', instructor_1.default.deleteCourse);
exports.default = router;
//# sourceMappingURL=instructor.js.map