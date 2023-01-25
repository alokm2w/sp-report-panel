const express = require('express');
const bodyparser = require('body-parser');
var app = express();
const helpers = require('../../helpers/CommonHelpers')
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');

module.exports = async (req, res) => {

    try {
        console.log('start execution', helpers.currentDateTime());
        dbconn.query(sqlQueries.query.getAllStoresWithAllowedMissing, function (err, data) {
            if (err) throw err

            data.length > 0 ? req.flash('success', 'Result Found!') : req.flash('error', 'Result Not Found!');
            res.render('stores-list', {
                reports: data,
                name: "Missing Orders",
                data: data[0]
            });
        })
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
