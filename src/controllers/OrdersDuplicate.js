const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const {
  parse
} = require("csv-parse");
const helpers = require('../../helpers/CommonHelpers');
var app = express();

module.exports = async (req, res) => {
  try {
    filename = './public/checksList/ordersDuplicate.csv'

    console.log('Execution Start', helpers.currentDateTime());

    process.on('uncaughtException', (error) => {
      helpers.logError(type = "Orders Duplicate", error.message)
      console.error(`uncaughtException: ${error.message}`);
    });

    var dataArr = [];
    fs.createReadStream(filename)
      .pipe(parse({
        delimiter: ";"
      }))
      .on("data", function (row) {
        dataArr.push(row)
      })
      .on("end", function () {
        dataArr.length > 0 ? req.flash('success', 'Result Found!') : req.flash('error', 'Result Not Found!');
        res.render('duplicate-orders', {
          reports: dataArr,
          name: "Duplicate Orders",
        });
      })
      .on("error", function (error) {
        console.log(error.message);
      });
  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
}