const mysql = require('mysql2');
require('dotenv').config();

// var mysqlConnection = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.DBUSER,
//     password: process.env.PASSWORD,
//     database: process.env.DB,
//     port: process.env.PORT,
//     multipleStatements: true,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 300000,
//         idle: 100000,
//     },
// });

// mysqlConnection.connect((err, connection) => {
//     if (!err) {
//         console.log('Database1 Connection Established Successfully');
//         connection.release();
//     }
//     else {
//         console.log('Database1 Connection Failed!' + JSON.stringify(err, undefined, 2));
//     }

// });


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DB,
});

connection.connect(function (err) {
    if (err) {
        console.error('Database1 Connection Failed!' + JSON.stringify(err, undefined, 2));
        return;
    }
    console.log('Database1 Connection Established Successfully');
});


module.exports = connection;