const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_online_store',
    password: 'Bhav_6421!'
})

module.exports = pool.promise();