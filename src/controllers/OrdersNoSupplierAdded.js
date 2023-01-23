const fs = require('fs');
helpers = require('../../helpers/CommonHelpers')
const { parse } = require("csv-parse");

module.exports = async (req, res) => {

    try {
        filename = './public/checksList/ordersNoSupplierAdded.csv'
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
                    name: "No Supplier Added",
                });
            })
            .on("error", function (error) {
                console.log(error.message);
            });

    } catch (error) {
        // self.emit('error', error)
        res.status(500).send(`Something went wrong! ${error}`)

    }



}
