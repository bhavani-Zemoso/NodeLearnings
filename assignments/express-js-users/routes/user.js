const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const users = [];

router.get('/users', (request, response, next) => {
    //response.sendFile(path.join(rootDir, 'views', 'user.html'));
    response.render('user', {pageTitle: 'Add User'})
})

router.post('/add-user', (request, response, next) => {
    users.push({username: request.body.username});
    response.redirect('/');
})

exports.routes = router;
exports.users = users;