const express = require('express')

const app = express();

// app.use('/log', (request, response, next) => {
//     console.log('Logging to console');
//     next();
// })

// app.use('/', (request, response, next) => {
//     response.send('<h1>Express.js</h1>');
// })

app.use('/users', (request, response, next) => {
    response.send('<ul><li>User 1</li><li>User 2</li></ul>')
})

app.use('/', (request, response, next) => {
    response.send('<h1>Express.js</h1>');
})

app.listen(3000);