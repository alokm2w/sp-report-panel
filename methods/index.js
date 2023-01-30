
const CommonHelpers = require('../helpers/CommonHelpers');
const columnArr = require('../helpers/columnArr');
const helpers = require('../helpers/csv_helpers');
const fs = require('fs');
const fastCsv = require('fast-csv');
const dbconn = require('../dbconnection');
const dbconn2 = require('../dbconnection2');
const sqlQueries = require('../src/models/sql_queries');
var _ = require('lodash');
const { parse } = require("csv-parse");
require('dotenv').config();
const async = require('async');

function orderCostAdded(dataArr) {
    try {
        console.log("start execution Order Cost Added", CommonHelpers.currentDateTime());

        var orderStatus = 4
        var quote_price = 28

        const status_arr = ["Waiting for tracking update", "In transit", "Processing", "Fulfilled"];
        let result = dataArr.filter(item => !status_arr.includes(item[orderStatus]) && item[quote_price] != 0);

        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersCostAdded.csv', csvData);

        console.log('Orders Cost Added Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function orderDump(dataArr) {
    try {
        console.log('start execution orderDump');
        const groupedData = dataArr.reduce((acc, curr) => {
            const storeName = curr[columnArr.ColumnIndex.StoreName];
            if (!acc[storeName]) {
                acc[storeName] = [];
            }
            acc[storeName].push(curr);
            return acc;
        }, {});

        console.log('grouped', CommonHelpers.currentDateTime());

        i = 0;
        storeWithAvgOrders = [];
        for (const store of Object.entries(groupedData)) {
            if (store[0] != "") {
                sorted = store[1].filter(val => val[columnArr.ColumnIndex.OrderCreatedDate] != "" && CommonHelpers.formatDate(val[columnArr.ColumnIndex.OrderCreatedDate]) >= CommonHelpers.getBackDate(6))
                avgOrder = sorted.length / 7;
                storeWithAvgOrders[i] = [store[0], sorted.length, avgOrder.toFixed(2), `https://${store[0]}.myshopify.com/admin/orders`]
                i++
            }
        }

        const csvData = storeWithAvgOrders.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersDump.csv', csvData);

        console.log('Orders Dump Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function orderDuplicate(dataArr) {
    try {
        console.log('start execution orderDuplicate', CommonHelpers.currentDateTime());

        const groupBy = (arr, keys) => {
            return arr.reduce((acc, obj) => {
                const key = keys.map(k => obj[k]).join('|');
                acc[key] = acc[key] || [];
                acc[key].push(obj);
                return acc;
            }, {});
        }

        const duplicateArr = Object.values(groupBy(dataArr, [columnArr.ColumnIndex.OrderNumber, columnArr.ColumnIndex.StoreName])).filter(arr => arr.length > 1);

        let newData = []
        for (let i = 0; i < duplicateArr.length; i++) {
            for (let j = 0; j < duplicateArr[i].length; j++) {
                status_arr = ['fulfilled', 'cancelled'];
                if (!status_arr.includes(duplicateArr[i][j][columnArr.ColumnIndex.OrderStatus])) {
                    newData.push(duplicateArr[i][j]);
                }
            }
        }
        const ws = fs.createWriteStream('./public/checksList/ordersDuplicate.csv');
        fastCsv.write(newData, { headers: true, delimiter: ';' })
            .pipe(ws)
            .on('finish', () => {
                console.log('Orders Duplicate Done!', CommonHelpers.currentDateTime());
            });
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function orderInTransitDateIsShipped(dataArr) {
    try {
        console.log('start execution orderInTransitDateIsShipped', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.IntransitDate] != "" && item[columnArr.ColumnIndex.is_shipped] == 0);
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/orderInTransitDateIsShipped.csv', csvData);

        console.log('Orders In-Transit Date Is Shipped Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersInTransitDateWithStatus(dataArr) {
    try {
        console.log('start execution ordersInTransitDateWithStatus', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] != undefined && item[columnArr.ColumnIndex.OrderStatus].toLowerCase() == "waiting for tracking update" && item[columnArr.ColumnIndex.IntransitDate] != "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersInTransitDateWithStatus.csv', csvData);

        console.log('Orders In-Transit Date With Status Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersMissing() {
    try {
        var filename = process.env.FILENAME_RECENT;
        console.log('start execution ordersMissing', CommonHelpers.currentDateTime());
        dataArr = []
        fs.createReadStream(filename)
            .pipe(parse({ delimiter: ";", from_line: 2 }))
            .on("data", function (row) {
                dataArr.push(Object.assign({}, row));
            })
            .on("end", function () {
                var OrderNumber = 3;
                var StoreName = 6;
                const groupedData = _.mapValues(_.groupBy(dataArr, StoreName), (val) => _.map(val, OrderNumber));
                Object.keys(groupedData).forEach(key => {
                    groupedData[key] = groupedData[key].map(val => val != undefined && Number(val.match(/\d+/g)))
                });

                dbconn.getConnection((err, connection) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('Connection Established Successfully');
                    // use the connection
                    connection.query(sqlQueries.query.getAllowedMissingOrders, function (err, storesArr) {
                        connection.release();
                        MissingOrders = []
                        i = 0
                        for (const store of Object.keys(groupedData)) {
                            uniqueorderNum = CommonHelpers.removeDuplicateVal(groupedData[store])

                            min = Math.min(...uniqueorderNum);
                            max = Math.max(...uniqueorderNum);

                            missingOrderNums = []
                            j = 0
                            for (let index = min; index < max; index++) {
                                if (!uniqueorderNum.includes(index)) {
                                    missingOrderNums[j] = index;
                                    j++
                                }
                            }

                            let obj = storesArr.find(el => el.store_name == store);
                            allowedMissing = obj != undefined ? obj.allowed_missing_orders : 0;
                            if (uniqueorderNum.length > 1 && missingOrderNums.length > 0 && missingOrderNums.length > allowedMissing) {
                                MissingOrders[i] = [store, max - min, missingOrderNums.length, min, max, missingOrderNums]
                                i++
                            }
                        }
                        const csvData = MissingOrders.map(d => d.join(';')).join('\n').replace(/"/g, "'");
                        fs.writeFileSync('./public/checksList/ordersMissing.csv', csvData);
                        console.log('Orders Missing Done!', CommonHelpers.currentDateTime());
                    })
                })
            })
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersMissingInfo(dataArr) {
    try {
        console.log('start execution ordersMissingInfo', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.AgentSupportName] == "" || item[columnArr.ColumnIndex.StoreName] == "" || item[columnArr.ColumnIndex.OrderCreatedDate] == "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersMissingInfo.csv', csvData);

        console.log('Orders Missing Info Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoDateOfPayment(dataArr) {
    try {
        console.log('start execution ordersNoDateOfPayment', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.DateofPayment] == "" && item[columnArr.ColumnIndex.PaidByShopOwner].toLowerCase() == "paid");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoDateOfPayment.csv', csvData);

        console.log('Orders No Date Of Payment Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoMaxTime(dataArr) {
    try {
        console.log('start execution ordersNoMaxTime', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => (item[columnArr.ColumnIndex.MaxProcessingTime] == "" || item[columnArr.ColumnIndex.MaxDelieveryTime] == "" || item[columnArr.ColumnIndex.MaxProcessingTime] == 0 || item[columnArr.ColumnIndex.MaxDelieveryTime] == 0) && item[columnArr.ColumnIndex.AdminSupplierName] != "" && item[columnArr.ColumnIndex.supplierName] != ""
        );

        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoMaxTime.csv', csvData);

        console.log('Orders No Max Time Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoPaidOnPaidByShopOwner(dataArr) {
    try {
        console.log('start execution ordersNoPaidOnPaidByShopOwner', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.PaidByShopOwner] != undefined && item[columnArr.ColumnIndex.DateofPayment] != "" && item[columnArr.ColumnIndex.PaidByShopOwner].toLowerCase() == "pending");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoPaidOnPaidByShopOwner.csv', csvData);

        console.log('OrdersNoPaidOnPaidByShopOwner Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoSupplierAdded(dataArr) {
    try {
        console.log('start execution ordersNoSupplierAdded', CommonHelpers.currentDateTime());
        const status_arr = ["Waiting for tracking update", "In transit", "Processing", "Resend"];

        let result = dataArr.filter(item =>
            status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.AdminSupplierName] == "" ||
            status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.supplierName] == "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Fulfilled" && item[columnArr.ColumnIndex.OrderTrackingNumber] != "" && item[columnArr.ColumnIndex.AdminSupplierName] == "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Fulfilled" && item[columnArr.ColumnIndex.OrderTrackingNumber] != "" && item[columnArr.ColumnIndex.supplierName] == ""
        );
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoSupplierAdded.csv', csvData);

        console.log('OrdersNoSupplierAdded!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNotQuoted(dataArr) {
    try {
        console.log('start execution ordersNotQuoted', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Not quoted" && (item[columnArr.ColumnIndex.AdminSupplierName] != "" || item[columnArr.ColumnIndex.supplierName] != "" || item[columnArr.ColumnIndex.OrderProcessingDate] != "" || item[columnArr.ColumnIndex.PaidByShopOwner].toLowerCase() == "paid"));

        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNotQuoted.csv', csvData);

        console.log('OrdersNotQuoted Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoTrackingAdded(dataArr) {
    try {
        console.log('start execution ordersNoTrackingAdded', CommonHelpers.currentDateTime());
        const status_arr = ["Waiting for tracking update", "In transit"];
        let result = dataArr.filter(item => status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.OrderTrackingNumber] == "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoTrackingAdded.csv', csvData);

        console.log('OrdersNoTrackingAdded Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersOnHold(dataArr) {
    try {
        console.log('start execution ordersOnHold', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Hold" && item[columnArr.ColumnIndex.AdminSupplierName] != "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Hold" && item[columnArr.ColumnIndex.supplierName] != ""
        );
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersOnHold.csv', csvData);

        console.log('OrdersOnHold Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersPaymentPending(dataArr) {
    try {
        console.log('start execution ordersPaymentPending', CommonHelpers.currentDateTime());
        const status_arr = ["Address error", "Cancelled", "Fulfilled", "Hold", "Refund", "Not quoted"];
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderFinancialStatus] != undefined && item[columnArr.ColumnIndex.OrderFinancialStatus] != 'Order Financial Status' && item[columnArr.ColumnIndex.OrderFinancialStatus].toLowerCase() != "paid" && !status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]));

        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersPaymentPending.csv', csvData);

        console.log('ordersPaymentPending Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersShortTrackingNumber(dataArr) {
    try {
        console.log('start execution ordersShortTrackingNumber', CommonHelpers.currentDateTime());
        const status_arr = ["Refund", "Resend"];
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderTrackingNumber] && !status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.OrderTrackingNumber] != "" && item[columnArr.ColumnIndex.OrderTrackingNumber].length < 10);
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersShortTrackingNumber.csv', csvData);

        console.log('ordersShortTrackingNumber Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersTrackingNumberAdded(dataArr) {
    try {
        console.log('start execution ordersTrackingNumberAdded', CommonHelpers.currentDateTime());
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Processing" && item[columnArr.ColumnIndex.OrderTrackingNumber] != "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersTrackingNumberAdded.csv', csvData);

        console.log('ordersTrackingNumberAdded Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

// function ordersDupTrackingNumber(a) {
//     try {
//         TrackingIndex = 53
//         AddressIndex = 37
//         CityIndex = 39
//         ClientIndex = 56
//         OrderIdIndex = 1

//         let found = []
//         let dup = {}

//         console.log('start execution ordersDupTrackingNumber', helpers.currentDateTime());
//         for (let i = 0; i < a.length; i++) {
//             if (a[i][TrackingIndex] != "") {

//                 for (let j = i + 1; j < a.length; j++) {
//                     if (a[i][TrackingIndex] === a[j][TrackingIndex] && !found.includes(j) && a[i][CityIndex] !== a[j][CityIndex] && a[i][AddressIndex] !== a[j][AddressIndex] && a[i][ClientIndex] !== a[j][ClientIndex]) {
//                         if (i in dup) {
//                             found.push(j)
//                             dup[i].push(a[j])
//                         } else {
//                             dup[i] = []
//                             found.push(i)
//                             found.push(j)
//                             dup[i].push(a[i])
//                             dup[i].push(a[j])
//                         }
//                     }
//                 }
//             }
//         }

//         result = [];
//         i = 0;
//         for (const item of Object.keys(dup)) {
//             const capital = dup[item];
//             for (const duptackorders of capital) {
//                 result[i] = duptackorders;
//                 i++
//             }
//         }

//         const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
//         fs.writeFileSync('./public/checksList/ordersDupTrackingNumber.csv', csvData);
//         console.log('ordersDupTrackingNumber Done!', CommonHelpers.currentDateTime());

//     } catch (error) {
//         console.log(`Something went wrong! ${error}`)
//     }
// }

function ordersDupTrackingNumber(orders) {
    try {
        const trackingIndex = 53;
        const addressIndex = 37;
        const cityIndex = 39;
        const clientIndex = 56;
        const orderIdIndex = 1;

        const duplicates = {};

        // get duplicate tracking ids record
        orders.forEach((order, i) => {
            if (order[trackingIndex]) {
                const matchingOrders = orders.slice(i + 1).filter(o => o[trackingIndex] === order[trackingIndex] && (o[addressIndex] !== order[addressIndex] || o[cityIndex] !== order[cityIndex] || o[clientIndex] !== order[clientIndex]));
                if (matchingOrders.length) {
                    duplicates[order[orderIdIndex]] = [order, ...matchingOrders];
                }
            }
        });

        // filter duplicate records
        var duplicateTrackArr = [];
        j = 0;
        Object.values(duplicates).forEach(element => {
            element.forEach(el => {
                is_exist = duplicateTrackArr.find(innerItem => innerItem[0] == el[0]);
                if (is_exist == undefined) {
                    duplicateTrackArr[j] = el;
                    j++;
                }
            });
        });

        const csvData = duplicateTrackArr.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersDupTrackingNumber.csv', csvData);
        console.log('findDuplicateOrders Done!', CommonHelpers.currentDateTime());
    } catch (error) {
        if (error) console.log(error);
    }
}

function getStores() {
    try {
        console.log('start get store', CommonHelpers.currentDateTime());
        dbconn2.query(sqlQueries.query.getStores, function (err, data) {

            data.forEach(function (val, i) {
                dbconn.query(`SELECT id FROM stores where store_id = ${val.id}`, function (err, results, fields) {
                    if (err) throw err;

                    if (results.length > 0) {
                        CreateOrUpdate = `UPDATE stores SET store_name = '${val.name}', is_deleted = '${val.is_deleted}' WHERE store_id = '${val.id}'`;
                    } else {
                        CreateOrUpdate = `INSERT INTO stores (store_id, store_name, is_deleted) VALUES ('${val.id}', '${val.name}', '${val.is_deleted}')`;
                    }

                    dbconn.query(CreateOrUpdate, function (err, data2) {
                        if (err) console.log(err);
                    })
                });
            })
            console.log('Get Store Done!');
        });
    } catch (error) {
        if (error) console.log(error);
    }
}

function ordersMixup() {
    try {
        console.log('start execution ordersMixup', helpers.currentDateTime());

        const todayFilePath = process.env.FILENAME_RECENT;
        const yesterdayFilePath = process.env.FILENAME_YESTERDAY;
        todayArr = []
        yesterdayArr = []
        async.parallel([
            function (callback) {
                fs.createReadStream(todayFilePath)
                    .pipe(parse({ delimiter: ";" }))
                    .on("data", function (data) {
                        todayArr.push(data);
                    })
                    .on("end", function () {
                        console.log(`file1 successfully processed`);
                        callback();
                    });
            },
            function (callback) {
                fs.createReadStream(yesterdayFilePath)
                    .pipe(parse({ delimiter: ";" }))
                    .on("data", function (data) {
                        yesterdayArr.push(data);
                    })
                    .on("end", function () {
                        console.log(`file2 successfully processed`);
                        callback();
                    });
            }
        ], function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Start filtering mixup check.");
                changedData = [];
                todayArr.filter(item => { //check or compare data
                    ordertocheck = yesterdayArr.find(innerItem => innerItem[columnArr.ColumnIndex.OrderDetailId] == item[columnArr.ColumnIndex.OrderDetailId]);

                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ShopifyProductId] != item[columnArr.ColumnIndex.ShopifyProductId]) { //Shopify product ID
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Shopify product ID changed," : ordertocheck[60] += "Shopify product ID changed,";
                        // changedData[ordertocheck[0]] = ordertocheck;
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.shopify_variant_id] != item[columnArr.ColumnIndex.shopify_variant_id]) { //Shopify_variant_id
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Shopify variant ID changed," : ordertocheck[60] += "Shopify variant ID changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Quantity] != item[columnArr.ColumnIndex.Quantity]) { //Quantity
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Quantity changed," : ordertocheck[60] += "Quantity changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Country] != item[columnArr.ColumnIndex.Country]) { //Country
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Country changed," : ordertocheck[60] += "Country changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.CustomerName] != item[columnArr.ColumnIndex.CustomerName]) { //Customer name
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Customer name changed," : ordertocheck[60] += "Customer name changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.CustomerPhoneNumber] != item[columnArr.ColumnIndex.CustomerPhoneNumber]) { //Customer phone number
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Customer phone number changed," : ordertocheck[60] += "Customer phone number changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.CustomerEmail] != item[columnArr.ColumnIndex.CustomerEmail]) { //Customer Email
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Customer Email changed," : ordertocheck[60] += "Customer Email changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Address1] != item[columnArr.ColumnIndex.Address1]) { //Address1
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Address1 changed," : ordertocheck[60] += "Address1 changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.Address2] != item[columnArr.ColumnIndex.Address2]) { //Address2
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Address2 changed," : ordertocheck[60] += "Address2 changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.City] != item[columnArr.ColumnIndex.City]) { //City
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "City changed, " : ordertocheck[60] += "City changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ZipCode] != item[columnArr.ColumnIndex.ZipCode]) { //Zip code
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Zip code changed," : ordertocheck[60] += "Zip code changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ProductName] != item[columnArr.ColumnIndex.ProductName]) { //Product name
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Product name changed," : ordertocheck[60] += "Product name changed,";
                        changedData.push(ordertocheck);
                    }
                    if (ordertocheck != null && ordertocheck[columnArr.ColumnIndex.ProductVariant] != item[columnArr.ColumnIndex.ProductVariant]) { //Product variant
                        (ordertocheck[60] == undefined) ? ordertocheck[60] = "Product variant changed," : ordertocheck[60] += "Product variant changed,";
                        changedData.push(ordertocheck);
                    }
                })

                // remove null data
                // var result = CommonHelpers.removeEmptyValueFromArr(changedData);
                const csvData = changedData.map(d => d.join(';')).join('\n').replace(/"/g, "'");
                fs.writeFileSync('./public/checksList/ordersMixup.csv', csvData);
                console.log('ordersMixup Done!', CommonHelpers.currentDateTime());
            }
        });
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

module.exports = { orderCostAdded, orderDump, orderDuplicate, orderInTransitDateIsShipped, ordersInTransitDateWithStatus, ordersMissingInfo, ordersNoDateOfPayment, ordersNoMaxTime, ordersNoPaidOnPaidByShopOwner, ordersNoSupplierAdded, ordersNotQuoted, ordersNoTrackingAdded, ordersOnHold, ordersPaymentPending, ordersShortTrackingNumber, ordersTrackingNumberAdded, getStores, ordersMissing, ordersDupTrackingNumber, ordersMixup }