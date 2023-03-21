"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_2 = __importDefault(require("./utils/path"));
const database_1 = __importDefault(require("./utils/database"));
const instructor_1 = __importDefault(require("./schema/instructor"));
const course_1 = __importDefault(require("./schema/course"));
const error_1 = require("./controller/error");
const instructor_2 = __importDefault(require("./routes/instructor"));
const add_instructor_1 = __importDefault(require("./middleware/add-instructor"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(path_2.default, '/../public')));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(add_instructor_1.default.addInstructorAsUser);
app.set('view engine', 'pug');
app.set('views', path_1.default.join(path_2.default, '/../views'));
app.use(instructor_2.default);
app.use(error_1.get404);
instructor_1.default.hasMany(course_1.default, {
    sourceKey: 'id',
    foreignKey: 'instructorId',
    as: 'courses',
});
database_1.default
    .sync({ alter: true })
    .then((result) => {
    return add_instructor_1.default.findInstructor(1);
})
    .then((user) => {
    return add_instructor_1.default.getInstructor(user);
})
    .then((result) => {
    console.log('Connected to database and running app');
    app.listen(3000);
})
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=app.js.map