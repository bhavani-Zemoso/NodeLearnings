const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

router.get('/users', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'user.html'));
})

module.exports = router;