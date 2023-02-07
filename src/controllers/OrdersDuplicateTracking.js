const fs = require('fs');
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');
const {
  parse
} = require("csv-parse");
const _ = require('lodash');
const helpers = require('../../helpers/CommonHelpers');

async function genOrdersList(req, res, next) {

  try {
    dbconn.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Connection Established Successfully');
      process.on('uncaughtException', (error) => {
        helpers.logError(type = "Orders Duplicate Tracking", error.message)
        console.error(`uncaughtException: ${error.message}`);
      });
      // use the connection
      connection.query(sqlQueries.query.getOrdersIds, function (err, orderIds) {
        connection.release();
        filename = './public/checksList/ordersDupTrackingNumber.csv'
        console.log('start execution', helpers.currentDateTime());
        var dataArr = [];
        var OrderIdIndex = 1
        fs.createReadStream(filename)
          .pipe(parse({
            delimiter: ";"
          }))
          .on("data", function (row) {
            // Check OrdersId Exist In Ignore List
            if (!_.some(orderIds, {
                orders_id: row[OrderIdIndex]
              })) {
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

module.exports = {
  genOrdersList
}