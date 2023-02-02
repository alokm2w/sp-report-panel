const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');
const columnArr = require('../../helpers/columnArr');
const { parse } = require("csv-parse");
const _ = require('lodash');

async function genOrdersList(req, res, next) {

  try {
    dbconn.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Connection Established Successfully');
      // use the connection
      connection.query(sqlQueries.query.getOrdersIds, function (err, orderIds) {
        connection.release();
        filename = './public/checksList/ordersDupTrackingNumber.csv'
        console.log('start execution', helpers.currentDateTime());
        var arrayOfOrderIds = orderIds.map(val => val.orders_id);
        var dataArr = [];
        var OrderIdIndex = 1
        fs.createReadStream(filename)
          .pipe(parse({ delimiter: ";" }))
          .on("data", function (row) {
            // Check OrdersId Exist In Ignore List
            if (!_.some(orderIds, { orders_id: row[OrderIdIndex] })) {
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
      });
    });
  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
}

module.exports = { genOrdersList }
