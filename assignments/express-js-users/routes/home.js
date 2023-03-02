const path = require('path');

const express = require('express');

// const rootDir = require('../utils/path');

const userData = require('./user')

const router = express.Router();

router.get('/', (request, response, next) => {
    // response.sendFile(path.join(rootDir, 'views', 'home.html'));
    response.render('home', {pageTitle: 'Home', users: userData.users})
})

module.exports = router;