const express = require('express');
const app = express();
const dbconn = require('../dbconnection');
var session = require('express-session')
var flash = require('express-flash')
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(session({ secret: '123' }));
app.use(flash());
const convertcsv = require('../src/controllers/OrdersExport');
const requestIp = require('request-ip');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const OrdersDuplicateController = require('../src/controllers/OrdersDuplicateTracking');
const NoTrackingController = require('../src/controllers/OrdersNoTrackingAdded');
const NoSupplierController = require('../src/controllers/OrdersNoSupplierAdded');
const ShortTrackingController = require('../src/controllers/OrdersShortTrackingNumber');
const OrdersNotQuoted = require('../src/controllers/OrdersNotQuoted');
const OrdersOnHold = require('../src/controllers/OrdersOnHold');
const OrdersCostAdded = require('../src/controllers/OrdersCostAdded');
const OrdersMissingInfo = require('../src/controllers/OrdersMissingInfo');
const OrdersPaymentPending = require('../src/controllers/OrdersPaymentPending');
const OrdersNoMaxTime = require('../src/controllers/OrdersNoMaxTime');
const OrdersNoDateOfPayment = require('../src/controllers/OrdersNoDateOfPayment');
const OrdersNoPaidOnPaidByShopOwner = require('../src/controllers/OrdersNoPaidOnPaidByShopOwner');
const OrdersTrackingNumberAdded = require('../src/controllers/OrdersTrackingNumberAdded');
const OrdersInTransitDateWithStatus = require('../src/controllers/OrdersInTransitDateWithStatus');
const OrdersDuplicate = require('../src/controllers/OrdersDuplicate');
const OrdersInTransitDateIsShipped = require('../src/controllers/OrdersInTransitDateIsShipped');
const OrdersAllowedMissing = require('../src/controllers/OrdersAllowedMissing');
const OrdersDump = require('../src/controllers/OrdersDump');
const OrdersMissing = require('../src/controllers/OrdersMissing');
const OrdersMixup = require('../src/controllers/OrdersMixup');
const sqlQueries = require('../src/models/sql_queries');

/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('check-orders', {
    reports: [],
    name: "",
  });
});

// Routes
app.get('/duplicate-tracking', OrdersDuplicateController.genOrdersList);
app.get('/no-tracking-added', NoTrackingController);
app.get('/no-supplier-added', NoSupplierController);
app.get('/short-tracking-number', ShortTrackingController);
app.get('/orders-not-quoted', OrdersNotQuoted);
app.get('/orders-on-hold', OrdersOnHold);
app.get('/cost-added', OrdersCostAdded);
app.get('/missing-info', OrdersMissingInfo);
app.get('/payment-pending', OrdersPaymentPending);
app.get('/no-max-time', OrdersNoMaxTime);
app.get('/no-date-of-payment', OrdersNoDateOfPayment);
app.get('/no-paid', OrdersNoPaidOnPaidByShopOwner);
app.get('/tracking-number-added', OrdersTrackingNumberAdded);
app.get('/in-transit-date-order-status', OrdersInTransitDateWithStatus);
app.get('/duplicates', OrdersDuplicate);
app.get('/in-transit-date-is-shipped', OrdersInTransitDateIsShipped);
app.get('/orders-dump', OrdersDump);
app.get('/orders-missing', OrdersMissing);
app.get('/order-mixup', OrdersMixup);
app.get('/stores-list', OrdersAllowedMissing);


app.get('/check-today-orders', function (req, res, next) {
  res.render('check-orders', {
    reports: [],
    name: "",
  });
});

app.post('/add_order_id', function (req, res, next) {
  dbconn.query(`INSERT INTO filter_orderids (orders_id) VALUES ("${req.body.orders_id}")`, function (err, result) {
    if (err) throw err
    dbconn.query(sqlQueries.query.getOrdersIds, function (err, result) {
      if (err) throw err
      req.flash('success', 'Data stored!')
      res.redirect('/duplicate-tracking');
    })
  })
})

app.get('/delete-order-id', function (req, res) {
  var sqlDeleteQuery = `DELETE FROM filter_orderids WHERE orders_id=${req.query.orderId}`;
  dbconn.query(sqlDeleteQuery, function (err, result) {
    if (err) throw err
    req.flash('error', 'Data deleted!')
    res.redirect('/duplicate-tracking');
  })
});

app.post('/update-missing-order', function (req, res) {
  var sqlDeleteQuery = `UPDATE stores SET allowed_missing_orders = ${req.body.missingNumber} WHERE store_id = ${req.body.id}`;
  dbconn.query(sqlDeleteQuery, function (err, result) {
    if (err) throw err
    req.flash('success', 'Data updated!')
    res.redirect('/stores-list');
  })
});

// Orders List Page
app.get("/orders-export", (req, res) => {
  res.render('order-export', {
    title: 'Service Point',
    orderFileLink: '',
    productFileLink: '',
  });
});

// export orders csv
app.get('/api/convertcsv', convertcsv);

// download orders zip
app.get('/download-orders-list/:filename?', function (req, res) {
  const file = `./ordersList/${req.params.filename}`;
  res.download(file);
});

// Api orders zip
app.get('/download-orders', function (req, res) {
  const clientIp = requestIp.getClientIp(req);
  console.log('IP=', clientIp);
  if (!process.env.IP_ADDRESS.includes(req.ip) && 0) { // Wrong IP address
    res.send('permission denied');
  } else {
    var files = fs.readdirSync('./ordersList');
    storefilename = files[0];
    if (typeof (storefilename) != 'undefined') {
      res.sendFile(path.resolve("./" + `/ordersList/${storefilename}`));
    } else {
      res.send(`File Not Available:${storefilename}`);
    }
  }
});

module.exports = app;
