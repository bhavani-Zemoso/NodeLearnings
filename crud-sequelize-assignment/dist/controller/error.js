"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get404 = void 0;
const get404 = (_req, res, _next) => {
    res.status(404).render('error', { pageTitle: 'Page not found', path: '' });
};
exports.get404 = get404;
//# sourceMappingURL=error.js.map