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
        var sqlQuery = sql_queries.query.get_orders_detail;
        console.log('start fetching records', helpers.currentDateTime())
        dbconn.query(sqlQuery, async function (error, data, fields) {
            if (error) {
                throw error;
            } else {
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

                if (result.length > 0) {
                    req.flash('success', 'Result Found!')
                } else {
                    req.flash('error', 'Result Not Found!')
                }

                res.redirect('/')
                // res.render('/', {
                //     title: 'service point',
                //     filename: `${filename}.zip`,
                //     orderFileLink: `${process.env.APPURL}/download-orders-list/${filename}`,
                // });
            }
        });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }

};