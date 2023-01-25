const mysql = require('mysql2');
require('dotenv').config();

// var mysqlConnection = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.DBUSER,
//     password: process.env.PASSWORD,
//     database: process.env.DB,
//     port: process.env.PORT,
//     multipleStatements: false,
//     pool: {
//         max: 10,
//         min: 0,
//         acquire: 300000,
//         idle: 100000,
//     },
// });

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: process.env.PORT,
    multipleStatements: true,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool;