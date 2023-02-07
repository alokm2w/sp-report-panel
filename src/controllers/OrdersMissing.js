const helpers = require('../../helpers/CommonHelpers');
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');
var _ = require('lodash');
const {
    parse
} = require("csv-parse");
const fs = require('fs');
module.exports = async (req, res) => {

    try {
        filename = './public/checksList/ordersMissing.csv'
        process.on('uncaughtException', (error) => {
            helpers.logError(type = "Orders Missing", error.message)
            console.error(`uncaughtException: ${error.message}`);
        });

        var dataArr = [];
        fs.createReadStream(filename)
            .pipe(parse({
                delimiter: ";"
            }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {
                dataArr.length > 0 ? req.flash('success', 'Result Found!') : req.flash('error', 'Result Not Found!');
                res.render('missing-orders', {
                    reports: dataArr,
                    name: "Missing Orders Number",
                    data: []
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}