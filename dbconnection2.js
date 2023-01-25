const mysql = require('mysql2');
require('dotenv').config();

// var mysqlConnection = mysql.createConnection({
//     host: process.env.HOST2,
//     user: process.env.DBUSER2,
//     password: process.env.PASSWORD2,
//     database: process.env.DB2,
//     port: process.env.PORT2,
//     multipleStatements: false,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 300000,
//         idle: 100000,
//     },
// });

const pool = mysql.createPool({
    host: process.env.HOST2,
    user: process.env.DBUSER2,
    password: process.env.PASSWORD2,
    database: process.env.DB2,
    port: process.env.PORT2,
    multipleStatements: true,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool;