const express = require('express');
const bodyparser = require('body-parser');
const dbconn = require('../../dbconnection2');
const fs = require('fs');
const sql_queries = require('../models/sql_queries');
const helpers = require('../../helpers/csv_helpers');
require('dotenv').config();
var app = express();
app.use(bodyparser.json());
var rimraf = require("rimraf");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = async (req, res) => {
    try {
        console.log('start fetching records', helpers.currentDateTime());
        dbconn.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Connection Established Successfully');
            process.on('uncaughtException', (error) => {
                helpers.logError(type = "Orders Export", error.message)
                console.error(`uncaughtException: ${error.message}`);
            });

            // use the connection
            connection.query(sql_queries.query.get_orders_detail, async function (error, data, fields) {
                connection.release();
                console.log('start execution', helpers.currentDateTime());
                var filename = 'ordersList_today';
                // var filename = 'OrdersList_' + helpers.currentDateTime();
                const zipFileDir = './ordersList';

                // delete ordersList dir
                rimraf(zipFileDir, function () {
                    // create temp directory
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
                }
                req.flash('success', 'Result Found!')
                res.redirect('/')
            });
        });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
};