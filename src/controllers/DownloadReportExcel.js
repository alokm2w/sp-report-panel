const Excel = require('exceljs');
const fs = require('fs');
var excel = require('excel4node');
const parse = require('csv-parser');

const fastcsv = require('fast-csv');
module.exports = async (req, res) => {
    try {

        // Create a new instance of a Workbook class
        var workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var worksheet1 = workbook.addWorksheet('CostAdded');
        var worksheet2 = workbook.addWorksheet('InTransitDateIsShipped');
        var worksheet3 = workbook.addWorksheet('Duplicate');
        var worksheet4 = workbook.addWorksheet('DuplicateTrackingNumber');
        var worksheet5 = workbook.addWorksheet('InTransitDateWithStatus');
        var worksheet6 = workbook.addWorksheet('NotQuoted');
        var worksheet7 = workbook.addWorksheet('MissingInfo');
        var worksheet8 = workbook.addWorksheet('NoDateOfPayment');
        var worksheet9 = workbook.addWorksheet('NoMaxTime');
        var worksheet10 = workbook.addWorksheet('NoPaidOnPaidByShopOwner');
        var worksheet11 = workbook.addWorksheet('NoSupplierAdded');
        var worksheet12 = workbook.addWorksheet('NoTrackingAdded');
        var worksheet13 = workbook.addWorksheet('OnHold');
        var worksheet14 = workbook.addWorksheet('PaymentPending');
        var worksheet15 = workbook.addWorksheet('ShortTrackingNumber');
        var worksheet16 = workbook.addWorksheet('TrackingNumberAdded');
        var worksheet17 = workbook.addWorksheet('ordersDump');
        var worksheet18 = workbook.addWorksheet('ordersMissing');
        var worksheet19 = workbook.addWorksheet('ordersMixup');

        // Style for headers
        var style = workbook.createStyle({
            font: {
                color: '#000000',
                // size: 11
            }
        });

        var styleForData = workbook.createStyle({
            font: {
                color: '#000000',
                // size: 10
            }
        });

        function generateExcelSheet(array, worksheet) {
            let row = 2;//Row starts from 2 as 1st row is for headers.
            for (let i in array) {
                let o = 1;
                //This depends on numbers of columns to fill.
                worksheet.cell(row, o).string(array[i][1]).style(styleForData);
                worksheet.cell(row, o + 1).string(array[i][2]).style(styleForData);
                worksheet.cell(row, o + 2).string(array[i][3]).style(styleForData);
                worksheet.cell(row, o + 3).string(array[i][4]).style(styleForData);
                worksheet.cell(row, o + 4).string(array[i][5]).style(styleForData);
                worksheet.cell(row, o + 5).string(array[i][6]).style(styleForData);
                worksheet.cell(row, o + 6).string(array[i][7]).style(styleForData);
                worksheet.cell(row, o + 7).string(array[i][8]).style(styleForData);
                worksheet.cell(row, o + 8).string(array[i][19]).style(styleForData);
                worksheet.cell(row, o + 9).string(array[i][20]).style(styleForData);
                worksheet.cell(row, o + 10).string(array[i][23]).style(styleForData);
                worksheet.cell(row, o + 11).string(array[i][27]).style(styleForData);
                worksheet.cell(row, o + 12).string(array[i][28]).style(styleForData);
                worksheet.cell(row, o + 13).string(array[i][32]).style(styleForData);
                worksheet.cell(row, o + 14).string(array[i][33]).style(styleForData);
                worksheet.cell(row, o + 15).string(array[i][49]).style(styleForData);
                worksheet.cell(row, o + 16).string(array[i][50]).style(styleForData);
                worksheet.cell(row, o + 17).string(array[i][51]).style(styleForData);
                worksheet.cell(row, o + 18).string(array[i][52]).style(styleForData);
                worksheet.cell(row, o + 19).string(array[i][53]).style(styleForData);
                worksheet.cell(row, o + 20).string(array[i][56]).style(styleForData);
                worksheet.cell(row, o + 21).string(array[i][48]).style(styleForData);
                worksheet.cell(row, o + 22).string(array[i][34]).style(styleForData);
                worksheet.cell(row, o + 23).string(array[i][54]).style(styleForData);
                worksheet.cell(row, o + 24).string(array[i][55]).style(styleForData);
                row = row + 1;
            }
        }

        //Generate Orders Dump Excel Tab
        function generateDumpExcelSheet(array, worksheet) {
            let row = 2;//Row starts from 2 as 1st row is for headers.
            for (let i in array) {
                let o = 1;
                //This depends on numbers of columns to fill.
                worksheet.cell(row, o).string(array[i][0]).style(styleForData);
                worksheet.cell(row, o + 1).string(array[i][1]).style(styleForData);
                worksheet.cell(row, o + 2).string(array[i][2]).style(styleForData);
                worksheet.cell(row, o + 3).string(array[i][3]).style(styleForData);
                row = row + 1;
            }
        }

        //Generate Orders MIssing Excel Tab
        function generateMissingExcelSheet(array, worksheet) {
            let row = 2;//Row starts from 2 as 1st row is for headers.
            for (let i in array) {
                let o = 1;
                //This depends on numbers of columns to fill.
                worksheet.cell(row, o).string(array[i][0]).style(styleForData);
                worksheet.cell(row, o + 1).string(array[i][1]).style(styleForData);
                worksheet.cell(row, o + 2).string(array[i][2]).style(styleForData);
                worksheet.cell(row, o + 3).string(array[i][3]).style(styleForData);
                worksheet.cell(row, o + 4).string(array[i][4]).style(styleForData);
                worksheet.cell(row, o + 5).string(array[i][5]).style(styleForData);
                worksheet.cell(row, o + 6).string(array[i][6]).style(styleForData);
                row = row + 1;
            }
        }

        //Generate Orders MMixup Excel Tab
        function generateMixupExcelSheet(array, worksheet) {
            let row = 2;//Row starts from 2 as 1st row is for headers.
            for (let i in array) {
                let o = 1;
                //This depends on numbers of columns to fill.
                worksheet.cell(row, o).string(array[i][35]).style(styleForData);
                worksheet.cell(row, o + 1).string(array[i][35]).style(styleForData);
                worksheet.cell(row, o + 2).string(array[i][37]).style(styleForData);
                worksheet.cell(row, o + 3).string(array[i][38]).style(styleForData);
                worksheet.cell(row, o + 4).string(array[i][39]).style(styleForData);
                worksheet.cell(row, o + 5).string(array[i][44]).style(styleForData);
                worksheet.cell(row, o + 6).string(array[i][42]).style(styleForData);
                worksheet.cell(row, o + 7).string(array[i][60]).style(styleForData);
                row = row + 1;
            }
        }

        const ordersCostAdded = [];
        fs.createReadStream('./public/checksList/ordersCostAdded.csv')
            .pipe(fastcsv.parse({ delimiter: ';' }))
            .on('data', (data) => ordersCostAdded.push(data))
            .on('end', () => {
                //Header With All columns
                worksheet1.cell(1, 1).string('Order ID').style(style);
                worksheet1.cell(1, 2).string('OrderDetail ID').style(style);
                worksheet1.cell(1, 3).string('Order Number').style(style);
                worksheet1.cell(1, 4).string('Order Status').style(style);
                worksheet1.cell(1, 5).string('Order Financial Status').style(style);
                worksheet1.cell(1, 6).string('Store Name').style(style);
                worksheet1.cell(1, 7).string('Product Name').style(style);
                worksheet1.cell(1, 8).string('Product Variant').style(style);
                worksheet1.cell(1, 9).string('Shopify Product ID').style(style);
                worksheet1.cell(1, 10).string('Quantity').style(style);
                worksheet1.cell(1, 11).string('shopify_variant_id').style(style);
                worksheet1.cell(1, 12).string('supplier name').style(style);
                worksheet1.cell(1, 13).string('quote_price').style(style);
                worksheet1.cell(1, 14).string('Customer Name').style(style);
                worksheet1.cell(1, 15).string('Paid by shop owner').style(style);
                worksheet1.cell(1, 16).string('Max Processing Time').style(style);
                worksheet1.cell(1, 17).string('Max Delievery Time').style(style);
                worksheet1.cell(1, 18).string('Admin supplier name').style(style);
                worksheet1.cell(1, 19).string('Agent support name').style(style);
                worksheet1.cell(1, 20).string('order_tracking_number').style(style);
                worksheet1.cell(1, 21).string('Client Name').style(style);
                worksheet1.cell(1, 22).string('Intransit Date').style(style);
                worksheet1.cell(1, 23).string('Date of payment').style(style);
                worksheet1.cell(1, 24).string('Order Created Date').style(style);
                worksheet1.cell(1, 25).string('Order Processing Date').style(style);
                generateExcelSheet(ordersCostAdded, worksheet1);
                const orderInTransitDateIsShipped = [];
                fs.createReadStream('./public/checksList/orderInTransitDateIsShipped.csv')
                    .pipe(fastcsv.parse({ delimiter: ';' }))
                    .on('data', (data) => orderInTransitDateIsShipped.push(data))
                    .on('end', () => {
                        //Header With All columns
                        worksheet2.cell(1, 1).string('Order ID').style(style);
                        worksheet2.cell(1, 2).string('OrderDetail ID').style(style);
                        worksheet2.cell(1, 3).string('Order Number').style(style);
                        worksheet2.cell(1, 4).string('Order Status').style(style);
                        worksheet2.cell(1, 5).string('Order Financial Status').style(style);
                        worksheet2.cell(1, 6).string('Store Name').style(style);
                        worksheet2.cell(1, 7).string('Product Name').style(style);
                        worksheet2.cell(1, 8).string('Product Variant').style(style);
                        worksheet2.cell(1, 9).string('Shopify Product ID').style(style);
                        worksheet2.cell(1, 10).string('Quantity').style(style);
                        worksheet2.cell(1, 11).string('shopify_variant_id').style(style);
                        worksheet2.cell(1, 12).string('supplier name').style(style);
                        worksheet2.cell(1, 13).string('quote_price').style(style);
                        worksheet2.cell(1, 14).string('Customer Name').style(style);
                        worksheet2.cell(1, 15).string('Paid by shop owner').style(style);
                        worksheet2.cell(1, 16).string('Max Processing Time').style(style);
                        worksheet2.cell(1, 17).string('Max Delievery Time').style(style);
                        worksheet2.cell(1, 18).string('Admin supplier name').style(style);
                        worksheet2.cell(1, 19).string('Agent support name').style(style);
                        worksheet2.cell(1, 20).string('order_tracking_number').style(style);
                        worksheet2.cell(1, 21).string('Client Name').style(style);
                        worksheet2.cell(1, 22).string('Intransit Date').style(style);
                        worksheet2.cell(1, 23).string('Date of payment').style(style);
                        worksheet2.cell(1, 24).string('Order Created Date').style(style);
                        worksheet2.cell(1, 25).string('Order Processing Date').style(style);
                        generateExcelSheet(orderInTransitDateIsShipped, worksheet2);
                        const ordersDuplicate = [];
                        fs.createReadStream('./public/checksList/ordersDuplicate.csv')
                            .pipe(fastcsv.parse({ delimiter: ';' }))
                            .on('data', (data) => ordersDuplicate.push(data))
                            .on('end', () => {
                                //Header With All columns
                                worksheet3.cell(1, 1).string('Order ID').style(style);
                                worksheet3.cell(1, 2).string('OrderDetail ID').style(style);
                                worksheet3.cell(1, 3).string('Order Number').style(style);
                                worksheet3.cell(1, 4).string('Order Status').style(style);
                                worksheet3.cell(1, 5).string('Order Financial Status').style(style);
                                worksheet3.cell(1, 6).string('Store Name').style(style);
                                worksheet3.cell(1, 7).string('Product Name').style(style);
                                worksheet3.cell(1, 8).string('Product Variant').style(style);
                                worksheet3.cell(1, 9).string('Shopify Product ID').style(style);
                                worksheet3.cell(1, 10).string('Quantity').style(style);
                                worksheet3.cell(1, 11).string('shopify_variant_id').style(style);
                                worksheet3.cell(1, 12).string('supplier name').style(style);
                                worksheet3.cell(1, 13).string('quote_price').style(style);
                                worksheet3.cell(1, 14).string('Customer Name').style(style);
                                worksheet3.cell(1, 15).string('Paid by shop owner').style(style);
                                worksheet3.cell(1, 16).string('Max Processing Time').style(style);
                                worksheet3.cell(1, 17).string('Max Delievery Time').style(style);
                                worksheet3.cell(1, 18).string('Admin supplier name').style(style);
                                worksheet3.cell(1, 19).string('Agent support name').style(style);
                                worksheet3.cell(1, 20).string('order_tracking_number').style(style);
                                worksheet3.cell(1, 21).string('Client Name').style(style);
                                worksheet3.cell(1, 22).string('Intransit Date').style(style);
                                worksheet3.cell(1, 23).string('Date of payment').style(style);
                                worksheet3.cell(1, 24).string('Order Created Date').style(style);
                                worksheet3.cell(1, 25).string('Order Processing Date').style(style);
                                generateExcelSheet(ordersDuplicate, worksheet3);
                                const ordersDupTrackingNumber = [];
                                fs.createReadStream('./public/checksList/ordersDupTrackingNumber.csv')
                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                    .on('data', (data) => ordersDupTrackingNumber.push(data))
                                    .on('end', () => {
                                        //Header With All columns
                                        worksheet4.cell(1, 1).string('Order ID').style(style);
                                        worksheet4.cell(1, 2).string('OrderDetail ID').style(style);
                                        worksheet4.cell(1, 3).string('Order Number').style(style);
                                        worksheet4.cell(1, 4).string('Order Status').style(style);
                                        worksheet4.cell(1, 5).string('Order Financial Status').style(style);
                                        worksheet4.cell(1, 6).string('Store Name').style(style);
                                        worksheet4.cell(1, 7).string('Product Name').style(style);
                                        worksheet4.cell(1, 8).string('Product Variant').style(style);
                                        worksheet4.cell(1, 9).string('Shopify Product ID').style(style);
                                        worksheet4.cell(1, 10).string('Quantity').style(style);
                                        worksheet4.cell(1, 11).string('shopify_variant_id').style(style);
                                        worksheet4.cell(1, 12).string('supplier name').style(style);
                                        worksheet4.cell(1, 13).string('quote_price').style(style);
                                        worksheet4.cell(1, 14).string('Customer Name').style(style);
                                        worksheet4.cell(1, 15).string('Paid by shop owner').style(style);
                                        worksheet4.cell(1, 16).string('Max Processing Time').style(style);
                                        worksheet4.cell(1, 17).string('Max Delievery Time').style(style);
                                        worksheet4.cell(1, 18).string('Admin supplier name').style(style);
                                        worksheet4.cell(1, 19).string('Agent support name').style(style);
                                        worksheet4.cell(1, 20).string('order_tracking_number').style(style);
                                        worksheet4.cell(1, 21).string('Client Name').style(style);
                                        worksheet4.cell(1, 22).string('Intransit Date').style(style);
                                        worksheet4.cell(1, 23).string('Date of payment').style(style);
                                        worksheet4.cell(1, 24).string('Order Created Date').style(style);
                                        worksheet4.cell(1, 25).string('Order Processing Date').style(style);
                                        generateExcelSheet(ordersDupTrackingNumber, worksheet4);
                                        const ordersInTransitDateWithStatus = [];
                                        fs.createReadStream('./public/checksList/ordersInTransitDateWithStatus.csv')
                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                            .on('data', (data) => ordersInTransitDateWithStatus.push(data))
                                            .on('end', () => {
                                                //Header With All columns
                                                worksheet5.cell(1, 1).string('Order ID').style(style);
                                                worksheet5.cell(1, 2).string('OrderDetail ID').style(style);
                                                worksheet5.cell(1, 3).string('Order Number').style(style);
                                                worksheet5.cell(1, 4).string('Order Status').style(style);
                                                worksheet5.cell(1, 5).string('Order Financial Status').style(style);
                                                worksheet5.cell(1, 6).string('Store Name').style(style);
                                                worksheet5.cell(1, 7).string('Product Name').style(style);
                                                worksheet5.cell(1, 8).string('Product Variant').style(style);
                                                worksheet5.cell(1, 9).string('Shopify Product ID').style(style);
                                                worksheet5.cell(1, 10).string('Quantity').style(style);
                                                worksheet5.cell(1, 11).string('shopify_variant_id').style(style);
                                                worksheet5.cell(1, 12).string('supplier name').style(style);
                                                worksheet5.cell(1, 13).string('quote_price').style(style);
                                                worksheet5.cell(1, 14).string('Customer Name').style(style);
                                                worksheet5.cell(1, 15).string('Paid by shop owner').style(style);
                                                worksheet5.cell(1, 16).string('Max Processing Time').style(style);
                                                worksheet5.cell(1, 17).string('Max Delievery Time').style(style);
                                                worksheet5.cell(1, 18).string('Admin supplier name').style(style);
                                                worksheet5.cell(1, 19).string('Agent support name').style(style);
                                                worksheet5.cell(1, 20).string('order_tracking_number').style(style);
                                                worksheet5.cell(1, 21).string('Client Name').style(style);
                                                worksheet5.cell(1, 22).string('Intransit Date').style(style);
                                                worksheet5.cell(1, 23).string('Date of payment').style(style);
                                                worksheet5.cell(1, 24).string('Order Created Date').style(style);
                                                worksheet5.cell(1, 25).string('Order Processing Date').style(style);
                                                generateExcelSheet(ordersInTransitDateWithStatus, worksheet6);
                                                const ordersNotQuoted = [];
                                                fs.createReadStream('./public/checksList/ordersNotQuoted.csv')
                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                    .on('data', (data) => ordersNotQuoted.push(data))
                                                    .on('end', () => {
                                                        //Header With All columns
                                                        worksheet6.cell(1, 1).string('Order ID').style(style);
                                                        worksheet6.cell(1, 2).string('OrderDetail ID').style(style);
                                                        worksheet6.cell(1, 3).string('Order Number').style(style);
                                                        worksheet6.cell(1, 4).string('Order Status').style(style);
                                                        worksheet6.cell(1, 5).string('Order Financial Status').style(style);
                                                        worksheet6.cell(1, 6).string('Store Name').style(style);
                                                        worksheet6.cell(1, 7).string('Product Name').style(style);
                                                        worksheet6.cell(1, 8).string('Product Variant').style(style);
                                                        worksheet6.cell(1, 9).string('Shopify Product ID').style(style);
                                                        worksheet6.cell(1, 10).string('Quantity').style(style);
                                                        worksheet6.cell(1, 11).string('shopify_variant_id').style(style);
                                                        worksheet6.cell(1, 12).string('supplier name').style(style);
                                                        worksheet6.cell(1, 13).string('quote_price').style(style);
                                                        worksheet6.cell(1, 14).string('Customer Name').style(style);
                                                        worksheet6.cell(1, 15).string('Paid by shop owner').style(style);
                                                        worksheet6.cell(1, 16).string('Max Processing Time').style(style);
                                                        worksheet6.cell(1, 17).string('Max Delievery Time').style(style);
                                                        worksheet6.cell(1, 18).string('Admin supplier name').style(style);
                                                        worksheet6.cell(1, 19).string('Agent support name').style(style);
                                                        worksheet6.cell(1, 20).string('order_tracking_number').style(style);
                                                        worksheet6.cell(1, 21).string('Client Name').style(style);
                                                        worksheet6.cell(1, 22).string('Intransit Date').style(style);
                                                        worksheet6.cell(1, 23).string('Date of payment').style(style);
                                                        worksheet6.cell(1, 24).string('Order Created Date').style(style);
                                                        worksheet6.cell(1, 25).string('Order Processing Date').style(style);
                                                        generateExcelSheet(ordersNotQuoted, worksheet6);
                                                        const ordersMissingInfo = [];
                                                        fs.createReadStream('./public/checksList/ordersMissingInfo.csv')
                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                            .on('data', (data) => ordersMissingInfo.push(data))
                                                            .on('end', () => {
                                                                //Header With All columns
                                                                worksheet7.cell(1, 1).string('Order ID').style(style);
                                                                worksheet7.cell(1, 2).string('OrderDetail ID').style(style);
                                                                worksheet7.cell(1, 3).string('Order Number').style(style);
                                                                worksheet7.cell(1, 4).string('Order Status').style(style);
                                                                worksheet7.cell(1, 5).string('Order Financial Status').style(style);
                                                                worksheet7.cell(1, 6).string('Store Name').style(style);
                                                                worksheet7.cell(1, 7).string('Product Name').style(style);
                                                                worksheet7.cell(1, 8).string('Product Variant').style(style);
                                                                worksheet7.cell(1, 9).string('Shopify Product ID').style(style);
                                                                worksheet7.cell(1, 10).string('Quantity').style(style);
                                                                worksheet7.cell(1, 11).string('shopify_variant_id').style(style);
                                                                worksheet7.cell(1, 12).string('supplier name').style(style);
                                                                worksheet7.cell(1, 13).string('quote_price').style(style);
                                                                worksheet7.cell(1, 14).string('Customer Name').style(style);
                                                                worksheet7.cell(1, 15).string('Paid by shop owner').style(style);
                                                                worksheet7.cell(1, 16).string('Max Processing Time').style(style);
                                                                worksheet7.cell(1, 17).string('Max Delievery Time').style(style);
                                                                worksheet7.cell(1, 18).string('Admin supplier name').style(style);
                                                                worksheet7.cell(1, 19).string('Agent support name').style(style);
                                                                worksheet7.cell(1, 20).string('order_tracking_number').style(style);
                                                                worksheet7.cell(1, 21).string('Client Name').style(style);
                                                                worksheet7.cell(1, 22).string('Intransit Date').style(style);
                                                                worksheet7.cell(1, 23).string('Date of payment').style(style);
                                                                worksheet7.cell(1, 24).string('Order Created Date').style(style);
                                                                worksheet7.cell(1, 25).string('Order Processing Date').style(style);
                                                                generateExcelSheet(ordersMissingInfo, worksheet7);
                                                                const ordersNoDateOfPayment = [];
                                                                fs.createReadStream('./public/checksList/ordersNoDateOfPayment.csv')
                                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                    .on('data', (data) => ordersNoDateOfPayment.push(data))
                                                                    .on('end', () => {
                                                                        //Header With All columns
                                                                        worksheet8.cell(1, 1).string('Order ID').style(style);
                                                                        worksheet8.cell(1, 2).string('OrderDetail ID').style(style);
                                                                        worksheet8.cell(1, 3).string('Order Number').style(style);
                                                                        worksheet8.cell(1, 4).string('Order Status').style(style);
                                                                        worksheet8.cell(1, 5).string('Order Financial Status').style(style);
                                                                        worksheet8.cell(1, 6).string('Store Name').style(style);
                                                                        worksheet8.cell(1, 7).string('Product Name').style(style);
                                                                        worksheet8.cell(1, 8).string('Product Variant').style(style);
                                                                        worksheet8.cell(1, 9).string('Shopify Product ID').style(style);
                                                                        worksheet8.cell(1, 10).string('Quantity').style(style);
                                                                        worksheet8.cell(1, 11).string('shopify_variant_id').style(style);
                                                                        worksheet8.cell(1, 12).string('supplier name').style(style);
                                                                        worksheet8.cell(1, 13).string('quote_price').style(style);
                                                                        worksheet8.cell(1, 14).string('Customer Name').style(style);
                                                                        worksheet8.cell(1, 15).string('Paid by shop owner').style(style);
                                                                        worksheet8.cell(1, 16).string('Max Processing Time').style(style);
                                                                        worksheet8.cell(1, 17).string('Max Delievery Time').style(style);
                                                                        worksheet8.cell(1, 18).string('Admin supplier name').style(style);
                                                                        worksheet8.cell(1, 19).string('Agent support name').style(style);
                                                                        worksheet8.cell(1, 20).string('order_tracking_number').style(style);
                                                                        worksheet8.cell(1, 21).string('Client Name').style(style);
                                                                        worksheet8.cell(1, 22).string('Intransit Date').style(style);
                                                                        worksheet8.cell(1, 23).string('Date of payment').style(style);
                                                                        worksheet8.cell(1, 24).string('Order Created Date').style(style);
                                                                        worksheet8.cell(1, 25).string('Order Processing Date').style(style);
                                                                        generateExcelSheet(ordersNoDateOfPayment, worksheet8);
                                                                        const ordersNoMaxTime = [];
                                                                        fs.createReadStream('./public/checksList/ordersNoMaxTime.csv')
                                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                            .on('data', (data) => ordersNoMaxTime.push(data))
                                                                            .on('end', () => {
                                                                                //Header With All columns
                                                                                worksheet9.cell(1, 1).string('Order ID').style(style);
                                                                                worksheet9.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                worksheet9.cell(1, 3).string('Order Number').style(style);
                                                                                worksheet9.cell(1, 4).string('Order Status').style(style);
                                                                                worksheet9.cell(1, 5).string('Order Financial Status').style(style);
                                                                                worksheet9.cell(1, 6).string('Store Name').style(style);
                                                                                worksheet9.cell(1, 7).string('Product Name').style(style);
                                                                                worksheet9.cell(1, 8).string('Product Variant').style(style);
                                                                                worksheet9.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                worksheet9.cell(1, 10).string('Quantity').style(style);
                                                                                worksheet9.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                worksheet9.cell(1, 12).string('supplier name').style(style);
                                                                                worksheet9.cell(1, 13).string('quote_price').style(style);
                                                                                worksheet9.cell(1, 14).string('Customer Name').style(style);
                                                                                worksheet9.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                worksheet9.cell(1, 16).string('Max Processing Time').style(style);
                                                                                worksheet9.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                worksheet9.cell(1, 18).string('Admin supplier name').style(style);
                                                                                worksheet9.cell(1, 19).string('Agent support name').style(style);
                                                                                worksheet9.cell(1, 20).string('order_tracking_number').style(style);
                                                                                worksheet9.cell(1, 21).string('Client Name').style(style);
                                                                                worksheet9.cell(1, 22).string('Intransit Date').style(style);
                                                                                worksheet9.cell(1, 23).string('Date of payment').style(style);
                                                                                worksheet9.cell(1, 24).string('Order Created Date').style(style);
                                                                                worksheet9.cell(1, 25).string('Order Processing Date').style(style);
                                                                                generateExcelSheet(ordersNoMaxTime, worksheet9);
                                                                                const ordersNoPaidOnPaidByShopOwner = [];
                                                                                fs.createReadStream('./public/checksList/ordersNoPaidOnPaidByShopOwner.csv')
                                                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                    .on('data', (data) => ordersNoPaidOnPaidByShopOwner.push(data))
                                                                                    .on('end', () => {
                                                                                        //Header With All columns
                                                                                        worksheet10.cell(1, 1).string('Order ID').style(style);
                                                                                        worksheet10.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                        worksheet10.cell(1, 3).string('Order Number').style(style);
                                                                                        worksheet10.cell(1, 4).string('Order Status').style(style);
                                                                                        worksheet10.cell(1, 5).string('Order Financial Status').style(style);
                                                                                        worksheet10.cell(1, 6).string('Store Name').style(style);
                                                                                        worksheet10.cell(1, 7).string('Product Name').style(style);
                                                                                        worksheet10.cell(1, 8).string('Product Variant').style(style);
                                                                                        worksheet10.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                        worksheet10.cell(1, 10).string('Quantity').style(style);
                                                                                        worksheet10.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                        worksheet10.cell(1, 12).string('supplier name').style(style);
                                                                                        worksheet10.cell(1, 13).string('quote_price').style(style);
                                                                                        worksheet10.cell(1, 14).string('Customer Name').style(style);
                                                                                        worksheet10.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                        worksheet10.cell(1, 16).string('Max Processing Time').style(style);
                                                                                        worksheet10.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                        worksheet10.cell(1, 18).string('Admin supplier name').style(style);
                                                                                        worksheet10.cell(1, 19).string('Agent support name').style(style);
                                                                                        worksheet10.cell(1, 20).string('order_tracking_number').style(style);
                                                                                        worksheet10.cell(1, 21).string('Client Name').style(style);
                                                                                        worksheet10.cell(1, 22).string('Intransit Date').style(style);
                                                                                        worksheet10.cell(1, 23).string('Date of payment').style(style);
                                                                                        worksheet10.cell(1, 24).string('Order Created Date').style(style);
                                                                                        worksheet10.cell(1, 25).string('Order Processing Date').style(style);
                                                                                        generateExcelSheet(ordersNoPaidOnPaidByShopOwner, worksheet10);
                                                                                        const ordersNoSupplierAdded = [];
                                                                                        fs.createReadStream('./public/checksList/ordersNoSupplierAdded.csv')
                                                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                            .on('data', (data) => ordersNoSupplierAdded.push(data))
                                                                                            .on('end', () => {
                                                                                                //Header With All columns
                                                                                                worksheet11.cell(1, 1).string('Order ID').style(style);
                                                                                                worksheet11.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                                worksheet11.cell(1, 3).string('Order Number').style(style);
                                                                                                worksheet11.cell(1, 4).string('Order Status').style(style);
                                                                                                worksheet11.cell(1, 5).string('Order Financial Status').style(style);
                                                                                                worksheet11.cell(1, 6).string('Store Name').style(style);
                                                                                                worksheet11.cell(1, 7).string('Product Name').style(style);
                                                                                                worksheet11.cell(1, 8).string('Product Variant').style(style);
                                                                                                worksheet11.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                                worksheet11.cell(1, 10).string('Quantity').style(style);
                                                                                                worksheet11.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                                worksheet11.cell(1, 12).string('supplier name').style(style);
                                                                                                worksheet11.cell(1, 13).string('quote_price').style(style);
                                                                                                worksheet11.cell(1, 14).string('Customer Name').style(style);
                                                                                                worksheet11.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                                worksheet11.cell(1, 16).string('Max Processing Time').style(style);
                                                                                                worksheet11.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                                worksheet11.cell(1, 18).string('Admin supplier name').style(style);
                                                                                                worksheet11.cell(1, 19).string('Agent support name').style(style);
                                                                                                worksheet11.cell(1, 20).string('order_tracking_number').style(style);
                                                                                                worksheet11.cell(1, 21).string('Client Name').style(style);
                                                                                                worksheet11.cell(1, 22).string('Intransit Date').style(style);
                                                                                                worksheet11.cell(1, 23).string('Date of payment').style(style);
                                                                                                worksheet11.cell(1, 24).string('Order Created Date').style(style);
                                                                                                worksheet11.cell(1, 25).string('Order Processing Date').style(style);
                                                                                                generateExcelSheet(ordersNoSupplierAdded, worksheet11);
                                                                                                const ordersNoTrackingAdded = [];
                                                                                                fs.createReadStream('./public/checksList/ordersNoTrackingAdded.csv')
                                                                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                    .on('data', (data) => ordersNoTrackingAdded.push(data))
                                                                                                    .on('end', () => {
                                                                                                        //Header With All columns
                                                                                                        worksheet12.cell(1, 1).string('Order ID').style(style);
                                                                                                        worksheet12.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                                        worksheet12.cell(1, 3).string('Order Number').style(style);
                                                                                                        worksheet12.cell(1, 4).string('Order Status').style(style);
                                                                                                        worksheet12.cell(1, 5).string('Order Financial Status').style(style);
                                                                                                        worksheet12.cell(1, 6).string('Store Name').style(style);
                                                                                                        worksheet12.cell(1, 7).string('Product Name').style(style);
                                                                                                        worksheet12.cell(1, 8).string('Product Variant').style(style);
                                                                                                        worksheet12.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                                        worksheet12.cell(1, 10).string('Quantity').style(style);
                                                                                                        worksheet12.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                                        worksheet12.cell(1, 12).string('supplier name').style(style);
                                                                                                        worksheet12.cell(1, 13).string('quote_price').style(style);
                                                                                                        worksheet12.cell(1, 14).string('Customer Name').style(style);
                                                                                                        worksheet12.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                                        worksheet12.cell(1, 16).string('Max Processing Time').style(style);
                                                                                                        worksheet12.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                                        worksheet12.cell(1, 18).string('Admin supplier name').style(style);
                                                                                                        worksheet12.cell(1, 19).string('Agent support name').style(style);
                                                                                                        worksheet12.cell(1, 20).string('order_tracking_number').style(style);
                                                                                                        worksheet12.cell(1, 21).string('Client Name').style(style);
                                                                                                        worksheet12.cell(1, 22).string('Intransit Date').style(style);
                                                                                                        worksheet12.cell(1, 23).string('Date of payment').style(style);
                                                                                                        worksheet12.cell(1, 24).string('Order Created Date').style(style);
                                                                                                        worksheet12.cell(1, 25).string('Order Processing Date').style(style);
                                                                                                        generateExcelSheet(ordersNoTrackingAdded, worksheet12);
                                                                                                        const ordersOnHold = [];
                                                                                                        fs.createReadStream('./public/checksList/ordersOnHold.csv')
                                                                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                            .on('data', (data) => ordersOnHold.push(data))
                                                                                                            .on('end', () => {
                                                                                                                //Header With All columns
                                                                                                                worksheet13.cell(1, 1).string('Order ID').style(style);
                                                                                                                worksheet13.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                                                worksheet13.cell(1, 3).string('Order Number').style(style);
                                                                                                                worksheet13.cell(1, 4).string('Order Status').style(style);
                                                                                                                worksheet13.cell(1, 5).string('Order Financial Status').style(style);
                                                                                                                worksheet13.cell(1, 6).string('Store Name').style(style);
                                                                                                                worksheet13.cell(1, 7).string('Product Name').style(style);
                                                                                                                worksheet13.cell(1, 8).string('Product Variant').style(style);
                                                                                                                worksheet13.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                                                worksheet13.cell(1, 10).string('Quantity').style(style);
                                                                                                                worksheet13.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                                                worksheet13.cell(1, 12).string('supplier name').style(style);
                                                                                                                worksheet13.cell(1, 13).string('quote_price').style(style);
                                                                                                                worksheet13.cell(1, 14).string('Customer Name').style(style);
                                                                                                                worksheet13.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                                                worksheet13.cell(1, 16).string('Max Processing Time').style(style);
                                                                                                                worksheet13.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                                                worksheet13.cell(1, 18).string('Admin supplier name').style(style);
                                                                                                                worksheet13.cell(1, 19).string('Agent support name').style(style);
                                                                                                                worksheet13.cell(1, 20).string('order_tracking_number').style(style);
                                                                                                                worksheet13.cell(1, 21).string('Client Name').style(style);
                                                                                                                worksheet13.cell(1, 22).string('Intransit Date').style(style);
                                                                                                                worksheet13.cell(1, 23).string('Date of payment').style(style);
                                                                                                                worksheet13.cell(1, 24).string('Order Created Date').style(style);
                                                                                                                worksheet13.cell(1, 25).string('Order Processing Date').style(style);
                                                                                                                generateExcelSheet(ordersOnHold, worksheet13);
                                                                                                                const ordersPaymentPending = [];
                                                                                                                fs.createReadStream('./public/checksList/ordersPaymentPending.csv')
                                                                                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                                    .on('data', (data) => ordersPaymentPending.push(data))
                                                                                                                    .on('end', () => {
                                                                                                                        //Header With All columns
                                                                                                                        worksheet14.cell(1, 1).string('Order ID').style(style);
                                                                                                                        worksheet14.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                                                        worksheet14.cell(1, 3).string('Order Number').style(style);
                                                                                                                        worksheet14.cell(1, 4).string('Order Status').style(style);
                                                                                                                        worksheet14.cell(1, 5).string('Order Financial Status').style(style);
                                                                                                                        worksheet14.cell(1, 6).string('Store Name').style(style);
                                                                                                                        worksheet14.cell(1, 7).string('Product Name').style(style);
                                                                                                                        worksheet14.cell(1, 8).string('Product Variant').style(style);
                                                                                                                        worksheet14.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                                                        worksheet14.cell(1, 10).string('Quantity').style(style);
                                                                                                                        worksheet14.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                                                        worksheet14.cell(1, 12).string('supplier name').style(style);
                                                                                                                        worksheet14.cell(1, 13).string('quote_price').style(style);
                                                                                                                        worksheet14.cell(1, 14).string('Customer Name').style(style);
                                                                                                                        worksheet14.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                                                        worksheet14.cell(1, 16).string('Max Processing Time').style(style);
                                                                                                                        worksheet14.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                                                        worksheet14.cell(1, 18).string('Admin supplier name').style(style);
                                                                                                                        worksheet14.cell(1, 19).string('Agent support name').style(style);
                                                                                                                        worksheet14.cell(1, 20).string('order_tracking_number').style(style);
                                                                                                                        worksheet14.cell(1, 21).string('Client Name').style(style);
                                                                                                                        worksheet14.cell(1, 22).string('Intransit Date').style(style);
                                                                                                                        worksheet14.cell(1, 23).string('Date of payment').style(style);
                                                                                                                        worksheet14.cell(1, 24).string('Order Created Date').style(style);
                                                                                                                        worksheet14.cell(1, 25).string('Order Processing Date').style(style);
                                                                                                                        generateExcelSheet(ordersPaymentPending, worksheet14);
                                                                                                                        const ordersShortTrackingNumber = [];
                                                                                                                        fs.createReadStream('./public/checksList/ordersShortTrackingNumber.csv')
                                                                                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                                            .on('data', (data) => ordersShortTrackingNumber.push(data))
                                                                                                                            .on('end', () => {
                                                                                                                                //Header With All columns
                                                                                                                                worksheet15.cell(1, 1).string('Order ID').style(style);
                                                                                                                                worksheet15.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                                                                worksheet15.cell(1, 3).string('Order Number').style(style);
                                                                                                                                worksheet15.cell(1, 4).string('Order Status').style(style);
                                                                                                                                worksheet15.cell(1, 5).string('Order Financial Status').style(style);
                                                                                                                                worksheet15.cell(1, 6).string('Store Name').style(style);
                                                                                                                                worksheet15.cell(1, 7).string('Product Name').style(style);
                                                                                                                                worksheet15.cell(1, 8).string('Product Variant').style(style);
                                                                                                                                worksheet15.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                                                                worksheet15.cell(1, 10).string('Quantity').style(style);
                                                                                                                                worksheet15.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                                                                worksheet15.cell(1, 12).string('supplier name').style(style);
                                                                                                                                worksheet15.cell(1, 13).string('quote_price').style(style);
                                                                                                                                worksheet15.cell(1, 14).string('Customer Name').style(style);
                                                                                                                                worksheet15.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                                                                worksheet15.cell(1, 16).string('Max Processing Time').style(style);
                                                                                                                                worksheet15.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                                                                worksheet15.cell(1, 18).string('Admin supplier name').style(style);
                                                                                                                                worksheet15.cell(1, 19).string('Agent support name').style(style);
                                                                                                                                worksheet15.cell(1, 20).string('order_tracking_number').style(style);
                                                                                                                                worksheet15.cell(1, 21).string('Client Name').style(style);
                                                                                                                                worksheet15.cell(1, 22).string('Intransit Date').style(style);
                                                                                                                                worksheet15.cell(1, 23).string('Date of payment').style(style);
                                                                                                                                worksheet15.cell(1, 24).string('Order Created Date').style(style);
                                                                                                                                worksheet15.cell(1, 25).string('Order Processing Date').style(style);
                                                                                                                                generateExcelSheet(ordersShortTrackingNumber, worksheet15);
                                                                                                                                const ordersTrackingNumberAdded = [];
                                                                                                                                fs.createReadStream('./public/checksList/ordersTrackingNumberAdded.csv')
                                                                                                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                                                    .on('data', (data) => ordersTrackingNumberAdded.push(data))
                                                                                                                                    .on('end', () => {
                                                                                                                                        //Header With All columns
                                                                                                                                        worksheet16.cell(1, 1).string('Order ID').style(style);
                                                                                                                                        worksheet16.cell(1, 2).string('OrderDetail ID').style(style);
                                                                                                                                        worksheet16.cell(1, 3).string('Order Number').style(style);
                                                                                                                                        worksheet16.cell(1, 4).string('Order Status').style(style);
                                                                                                                                        worksheet16.cell(1, 5).string('Order Financial Status').style(style);
                                                                                                                                        worksheet16.cell(1, 6).string('Store Name').style(style);
                                                                                                                                        worksheet16.cell(1, 7).string('Product Name').style(style);
                                                                                                                                        worksheet16.cell(1, 8).string('Product Variant').style(style);
                                                                                                                                        worksheet16.cell(1, 9).string('Shopify Product ID').style(style);
                                                                                                                                        worksheet16.cell(1, 10).string('Quantity').style(style);
                                                                                                                                        worksheet16.cell(1, 11).string('shopify_variant_id').style(style);
                                                                                                                                        worksheet16.cell(1, 12).string('supplier name').style(style);
                                                                                                                                        worksheet16.cell(1, 13).string('quote_price').style(style);
                                                                                                                                        worksheet16.cell(1, 14).string('Customer Name').style(style);
                                                                                                                                        worksheet16.cell(1, 15).string('Paid by shop owner').style(style);
                                                                                                                                        worksheet16.cell(1, 16).string('Max Processing Time').style(style);
                                                                                                                                        worksheet16.cell(1, 17).string('Max Delievery Time').style(style);
                                                                                                                                        worksheet16.cell(1, 18).string('Admin supplier name').style(style);
                                                                                                                                        worksheet16.cell(1, 19).string('Agent support name').style(style);
                                                                                                                                        worksheet16.cell(1, 20).string('order_tracking_number').style(style);
                                                                                                                                        worksheet16.cell(1, 21).string('Client Name').style(style);
                                                                                                                                        worksheet16.cell(1, 22).string('Intransit Date').style(style);
                                                                                                                                        worksheet16.cell(1, 23).string('Date of payment').style(style);
                                                                                                                                        worksheet16.cell(1, 24).string('Order Created Date').style(style);
                                                                                                                                        worksheet16.cell(1, 25).string('Order Processing Date').style(style);
                                                                                                                                        generateExcelSheet(ordersTrackingNumberAdded, worksheet16);
                                                                                                                                        const ordersDump = [];
                                                                                                                                        fs.createReadStream('./public/checksList/ordersDump.csv')
                                                                                                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                                                            .on('data', (data) => ordersDump.push(data))
                                                                                                                                            .on('end', () => {
                                                                                                                                                //Header With All columns
                                                                                                                                                worksheet17.cell(1, 1).string('Store Name').style(style);
                                                                                                                                                worksheet17.cell(1, 2).string('Last Week Orders').style(style);
                                                                                                                                                worksheet17.cell(1, 3).string('Average Orders/week').style(style);
                                                                                                                                                worksheet17.cell(1, 4).string('Store Link').style(style);
                                                                                                                                                generateDumpExcelSheet(ordersDump, worksheet17);
                                                                                                                                                const ordersMissing = [];
                                                                                                                                                fs.createReadStream('./public/checksList/ordersMissing.csv')
                                                                                                                                                    .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                                                                    .on('data', (data) => ordersMissing.push(data))
                                                                                                                                                    .on('end', () => {
                                                                                                                                                        //Header With All columns
                                                                                                                                                        worksheet18.cell(1, 1).string('Store Name').style(style);
                                                                                                                                                        worksheet18.cell(1, 2).string('Allowed Missing Orders').style(style);
                                                                                                                                                        worksheet18.cell(1, 3).string('Total Orders').style(style);
                                                                                                                                                        worksheet18.cell(1, 4).string('No. of Missing Orders').style(style);
                                                                                                                                                        worksheet18.cell(1, 5).string('Min Order Number').style(style);
                                                                                                                                                        worksheet18.cell(1, 6).string('Max Order Number').style(style);
                                                                                                                                                        worksheet18.cell(1, 7).string('Missing Order Numbers').style(style);
                                                                                                                                                        generateMissingExcelSheet(ordersMissing, worksheet18);
                                                                                                                                                        const ordersMixup = [];
                                                                                                                                                        fs.createReadStream('./public/checksList/ordersMixup.csv')
                                                                                                                                                            .pipe(fastcsv.parse({ delimiter: ';' }))
                                                                                                                                                            .on('data', (data) => ordersMixup.push(data))
                                                                                                                                                            .on('end', () => {
                                                                                                                                                                //Header With All columns
                                                                                                                                                                worksheet19.cell(1, 1).string('Customer Phone Number').style(style);
                                                                                                                                                                worksheet19.cell(1, 2).string('Customer Email').style(style);
                                                                                                                                                                worksheet19.cell(1, 3).string('Address1').style(style);
                                                                                                                                                                worksheet19.cell(1, 4).string('Address2').style(style);
                                                                                                                                                                worksheet19.cell(1, 5).string('City').style(style);
                                                                                                                                                                worksheet19.cell(1, 6).string('Zip Code').style(style);
                                                                                                                                                                worksheet19.cell(1, 7).string('Country').style(style);
                                                                                                                                                                worksheet19.cell(1, 8).string('Changes').style(style);
                                                                                                                                                                generateMixupExcelSheet(ordersMixup, worksheet19);

                                                                                                                                                                workbook.write('./public/checksExcel/Excel.xlsx', function (err) {
                                                                                                                                                                    if (err) {
                                                                                                                                                                        res.status(500).send(`Something went wrong! ${err}`)
                                                                                                                                                                    } else {
                                                                                                                                                                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                                                                                                                                                        res.setHeader('Content-Disposition', 'attachment; filename=Orders-Checks-Output.xlsx');
                                                                                                                                                                        fs.createReadStream('./public/checksExcel/Excel.xlsx').pipe(res);
                                                                                                                                                                    }
                                                                                                                                                                });
                                                                                                                                                            })
                                                                                                                                                            .on("error", function (error) {
                                                                                                                                                                console.log(error.message);
                                                                                                                                                            });
                                                                                                                                                    })
                                                                                                                                                    .on("error", function (error) {
                                                                                                                                                        console.log(error.message);
                                                                                                                                                    });
                                                                                                                                            })
                                                                                                                                            .on("error", function (error) {
                                                                                                                                                console.log(error.message);
                                                                                                                                            });
                                                                                                                                    })
                                                                                                                                    .on("error", function (error) {
                                                                                                                                        console.log(error.message);
                                                                                                                                    });
                                                                                                                            })
                                                                                                                            .on("error", function (error) {
                                                                                                                                console.log(error.message);
                                                                                                                            });
                                                                                                                    })
                                                                                                                    .on("error", function (error) {
                                                                                                                        console.log(error.message);
                                                                                                                    });
                                                                                                            })
                                                                                                            .on("error", function (error) {
                                                                                                                console.log(error.message);
                                                                                                            });
                                                                                                    })
                                                                                                    .on("error", function (error) {
                                                                                                        console.log(error.message);
                                                                                                    });

                                                                                            })
                                                                                            .on("error", function (error) {
                                                                                                console.log(error.message);
                                                                                            });

                                                                                    })
                                                                                    .on("error", function (error) {
                                                                                        console.log(error.message);
                                                                                    });

                                                                            })
                                                                            .on("error", function (error) {
                                                                                console.log(error.message);
                                                                            });

                                                                    })
                                                                    .on("error", function (error) {
                                                                        console.log(error.message);
                                                                    });

                                                            })
                                                            .on("error", function (error) {
                                                                console.log(error.message);
                                                            });

                                                    })
                                                    .on("error", function (error) {
                                                        console.log(error.message);
                                                    });

                                            })
                                            .on("error", function (error) {
                                                console.log(error.message);
                                            });

                                    })
                                    .on("error", function (error) {
                                        console.log(error.message);
                                    });

                            })
                            .on("error", function (error) {
                                console.log(error.message);
                            });

                    })
                    .on("error", function (error) {
                        console.log(error.message);
                    });
            });
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}