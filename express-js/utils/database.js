// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_online_store',
//     password: 'Bhav_6421!'
// })

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_online_store', 'root', 'Bhav_6421!', {
	dialect: 'mysql',
	host: 'localhost',
});

module.exports = sequelize;
