const mysql = require('mysql2');
require('dotenv').config();

var mysqlConnection = mysql.createConnection({
    host: process.env.HOST2,
    user: process.env.DBUSER2,
    password: process.env.PASSWORD2,
    database: process.env.DB2,
    port: process.env.PORT2,
    multipleStatements: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 300000,
        idle: 100000,
    },
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Database2 Connection Established Successfully');
    else
        console.log('Database2 Connection Failed!' + JSON.stringify(err, undefined, 2));
});

module.exports = mysqlConnection;