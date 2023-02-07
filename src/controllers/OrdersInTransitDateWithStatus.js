const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
const helpers = require('../../helpers/CommonHelpers');
const {
    parse
} = require("csv-parse");

module.exports = async (req, res) => {

    try {
        filename = './public/checksList/ordersInTransitDateWithStatus.csv'
        console.log('start execution', helpers.currentDateTime());
        process.on('uncaughtException', (error) => {
            helpers.logError(type = "Orders In Transit Date With Status", error.message)
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
                res.render('check-orders', {
                    reports: dataArr,
                    name: "In-Transit Date while status on waiting for tracking update",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });



    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}