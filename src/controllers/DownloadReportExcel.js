const Excel = require('exceljs');
const fs = require('fs');
var excel = require('excel4node');


module.exports = async (req, res) => {
    try {

        // Create a new instance of a Workbook class
        var workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var worksheet = workbook.addWorksheet('Buy order types');
        var worksheet1 = workbook.addWorksheet('Sell order types');

        // Style for headers
        var style = workbook.createStyle({
            font: {
                color: '#EA3A14',
                size: 18
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        var styleForData = workbook.createStyle({
            font: {
                color: '#47180E',
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        let buyOrderTypes = [
            { name: "buy", id: "1", comment: "Normal Buy Order" },

            { name: "sip", id: "2", comment: "Sip Buy Order" },

            { name: "buy", id: "3", comment: "ETF Buy Order" },
        ]

        let sellOrderTypes = [
            { name: "sell", id: "1", comment: "Normal Sell Order" },

            { name: "emergencysell", id: "2", comment: "Emergency sell order" },

            { name: "coin", id: "3", comment: "Coin orders" },
            { name: "jewellery", id: "4", comment: "Jewellery orders" },

        ]


        //Tab 1 headers
        worksheet.cell(1, 1).string('Type').style(style);
        worksheet.cell(1, 2).string('Id').style(style);
        worksheet.cell(1, 3).string('Description').style(style);


        //Tab 2 headers
        worksheet1.cell(1, 1).string('Type').style(style);
        worksheet1.cell(1, 2).string('Id').style(style);
        worksheet1.cell(1, 3).string('Description').style(style);

        //Some logic
        function generateExcelSheet(array, worksheet) {
            let row = 2;//Row starts from 2 as 1st row is for headers.
            for (let i in array) {
                let o = 1;
                //This depends on numbers of columns to fill.
                worksheet.cell(row, o).string(array[i].name).style(styleForData);
                worksheet.cell(row, o + 1).string(array[i].id).style(styleForData);
                worksheet.cell(row, o + 2).string(array[i].comment).style(styleForData);

                row = row + 1;
            }
        }

        generateExcelSheet(buyOrderTypes, worksheet);

        generateExcelSheet(sellOrderTypes, worksheet1)
        workbook.write('Excel.xlsx');



    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }



}






