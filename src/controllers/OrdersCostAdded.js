const express = require('express');
const fs = require('fs');
const helpers = require('../../helpers/CommonHelpers');
const {
    parse
} = require("csv-parse");

module.exports = async (req, res) => {
    // console.log(req.query.fileName);

    try {
        filename = './public/checksList/ordersCostAdded.csv'
        console.log('start execution', helpers.currentDateTime());

        process.on('uncaughtException', (error) => {
            helpers.logError(type = "Orders Cost Added", error.message)
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
                    name: "Cost Added",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}