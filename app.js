const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const Routes = require('./routes/index');
const async = require('async');
var app = express();
const cron = require("node-cron");
const { parse } = require("csv-parse");
const helpers = require('./helpers/csv_helpers');
const sql_queries = require('./src/models/sql_queries')
const dbconn1 = require('./dbconnection'); // node
const dbconn2 = require('./dbconnection2'); // sp
const method = require('./methods/index');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var rimraf = require("rimraf");
require('dotenv').config();
process.env.TZ = 'Europe/Amsterdam'; //set timezone

app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.json());

app.use(Routes);

var server = app.listen(5000, () => {
    server.timeout = 2000000;
    console.log(`Server is running on url 5000`);
});

var filename = process.env.FILENAME_RECENT;

function exportcsv(callback) {
    try {
        dbconn2.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Connection Established Successfully');
            console.log('start fetching records', helpers.currentDateTime());
            // use the connection
            connection.query(sql_queries.query.get_orders_detail, async function (error, data, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                connection.release();
                console.log('start execution', helpers.currentDateTime());
                var filename = 'ordersList_today';
                const zipFileDir = './ordersList';

                // delete ordersList dir
                rimraf(zipFileDir, function () {
                    // create directory
                    const dir = './ordersTodaycsv'
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    const currentPath = `./ordersTodaycsv/ordersList_today.csv`;
                    const destinationPath = "./ordersYesterdaycsv/ordersList_yeterday.csv";

                    fs.rename(currentPath, destinationPath, function (err) {
                        if (err) {
                            throw err
                        } else {
                            console.log("Successfully moved the file!", helpers.currentDateTime());
                        }
                    });

                    // execute generate csv
                    genrateCSV()
                });

                const csvWriter = createCsvWriter({
                    path: `ordersTodaycsv/ordersList_today.csv`,
                    header: helpers.csvHeaderArr,
                    fieldDelimiter: ';'
                });

                async function genrateCSV() {
                    console.log('start generating csv', helpers.currentDateTime());
                    const csvArr = helpers.genOrdersArr(data)
                    const chunkSize = 500000;
                    for (let i = 0; i < csvArr.length; i += chunkSize) {
                        const chunk = csvArr.slice(i, i + chunkSize);
                        await csvWriter.writeRecords(chunk)
                    }

                    // convert to zip
                    helpers.genCsvToZip(zipFileDir, filename)
                        .then(callback(null, 'csv generated'))
                }

            })
        })
    } catch (error) {
        console.log(error.message);
    }
}

dataArr = [];

function getOrdersCsvData(callback) {
    try {
        console.log('start reading file', helpers.currentDateTime());

        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";", from_line: 2 }))
            .on("data", function (row) {
                dataArr.push(row);
            })
            .on("end", function () {
                StoreName = 6;
                dataArr.sort((a, b) => {
                    if (a.StoreName < b.StoreName) {
                        return -1;
                    }
                    if (a.StoreName > b.StoreName) {
                        return 1;
                    }
                    return 0;
                });
                console.log('File Readed!', helpers.currentDateTime());
                method.orderCostAdded(dataArr)
                method.orderDump(dataArr)
                method.orderDuplicate(dataArr)
                method.orderInTransitDateIsShipped(dataArr)
                method.ordersInTransitDateWithStatus(dataArr)
                method.ordersMissingInfo(dataArr)
                method.ordersNoDateOfPayment(dataArr)
                method.ordersNoMaxTime(dataArr)
                method.ordersNoPaidOnPaidByShopOwner(dataArr)
                method.ordersNoSupplierAdded(dataArr)
                method.ordersNotQuoted(dataArr)
                method.ordersNoTrackingAdded(dataArr)
                method.ordersOnHold(dataArr)
                method.ordersPaymentPending(dataArr)
                method.ordersShortTrackingNumber(dataArr)
                method.ordersTrackingNumberAdded(dataArr)
                method.ordersDupTrackingNumber(dataArr)
                method.getStores()
                method.ordersMissing()
                method.ordersMixup()
                callback(null, 'Method Call Done!');
            })
            .on("error", function (error) {
                console.log(error.message);
            });
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
        callback(null, 'error');
    }
}

const methods = [ getOrdersCsvData];

cron.schedule('00 03 18 * * *', () => {
    async.series(methods, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(results);
        }
    });
});