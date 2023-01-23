const express = require('express');
const fs = require('fs');
helpers = require('../../helpers/CommonHelpers')
const { parse } = require("csv-parse");

module.exports = async (req, res) => {
    try {
        filename = './public/checksList/ordersNoMaxTime.csv'
        var dataArr = [];
        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";" }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {
                dataArr.length > 0 ? req.flash('success', 'Result Found!') : req.flash('error', 'Result Not Found!');
                res.render('check-orders', {
                    reports: dataArr,
                    name: "No Max Time",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });

    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)

    }

}
