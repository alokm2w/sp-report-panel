const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');
const columnArr = require('../../helpers/columnArr');
const { parse } = require("csv-parse");


async function genOrdersList(req, res, next) {

  dbconn.query(sqlQueries.query.getOrdersIds, function (err, orderIds) {
    filename = './public/checksList/ordersDupTrackingNumber.csv'
    console.log('start execution', helpers.currentDateTime());

    var arrayOfOrderIds = orderIds.map(val => val.orders_id);
    var dataArr = [];
    var OrderIdIndex = 1
    fs.createReadStream(filename)
      .pipe(parse({ delimiter: ";" }))
      .on("data", function (row) {
        if (!arrayOfOrderIds.includes(Number(row[OrderIdIndex]))) {
          dataArr.push(row);
        }
      })
      .on("end", function () {
        dataArr.length > 0 ? req.flash('success', 'Result Found!') : req.flash('error', 'Result Not Found!');
        res.render('duplicate-tracking', {
          reports: dataArr,
          name: "Duplicate Tracking Numbers",
          orderIds: orderIds
        });
      })
      .on("error", function (error) {
        console.log(error.message);
      });
  })
}

module.exports = { genOrdersList }