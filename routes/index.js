const express = require('express');
const app = express();
const dbconn = require('../dbconnection');
var session = require('express-session');
var flash = require('express-flash');
const convertcsv = require('../src/controllers/OrdersExport');
const requestIp = require('request-ip');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const argon2 = require('argon2');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

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
const DownloadReportExcel = require('../src/controllers/DownloadReportExcel');

// Login Method
app.post('/auth', function (req, res) {
  // Capture the input fields
  let username = req.body.username;
  let password = req.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {

    // Execute SQL query that'll select the account from the database based on the specified username and password
    dbconn.query(`SELECT password FROM users WHERE username = ? `, [username], async function (error, results, fields) {
      if (error) throw error;
      // Verify the password with argon2
      const hash = results[0].password;
      const match = await argon2.verify(hash, password);

      // If the account exists
      if (results.length > 0 && match) {
        // Authenticate the user and Redirect to dashboard page
        req.session.loggedin = true;
        res.redirect('/dashboard');
      } else {
        req.flash('error', 'Incorrect Username or Password!');
        res.redirect('/');
      }
      res.end();
    });
  } else {
    req.flash('error', 'Please Enter Correct Credentials!');
    res.redirect('/');
    res.end();
  }
});

/* GET home page. */
app.get('/', function (req, res, next) {
  if (!req.session.loggedin) {
    res.render('login');
  } else {
    res.redirect('/dashboard');
  }
});

// check user logged In or Not
function checkAuth(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect('/');
  }
}

// Routes

app.get('/excel-report', DownloadReportExcel);

app.get('/duplicate-tracking', checkAuth, OrdersDuplicateController.genOrdersList);
app.get('/no-tracking-added', checkAuth, NoTrackingController);
app.get('/no-supplier-added', checkAuth, NoSupplierController);
app.get('/short-tracking-number', checkAuth, ShortTrackingController);
app.get('/orders-not-quoted', checkAuth, OrdersNotQuoted);
app.get('/orders-on-hold', checkAuth, OrdersOnHold);
app.get('/cost-added', checkAuth, OrdersCostAdded);
app.get('/missing-info', checkAuth, OrdersMissingInfo);
app.get('/payment-pending', checkAuth, OrdersPaymentPending);
app.get('/no-max-time', checkAuth, OrdersNoMaxTime);
app.get('/no-date-of-payment', checkAuth, OrdersNoDateOfPayment);
app.get('/no-paid', checkAuth, OrdersNoPaidOnPaidByShopOwner);
app.get('/tracking-number-added', checkAuth, OrdersTrackingNumberAdded);
app.get('/in-transit-date-order-status', checkAuth, OrdersInTransitDateWithStatus);
app.get('/duplicates', checkAuth, OrdersDuplicate);
app.get('/in-transit-date-is-shipped', checkAuth, OrdersInTransitDateIsShipped);
app.get('/orders-dump', checkAuth, OrdersDump);
app.get('/orders-missing', checkAuth, OrdersMissing);
app.get('/order-mixup', checkAuth, OrdersMixup);
app.get('/stores-list', checkAuth, OrdersAllowedMissing);

app.get('/dashboard', checkAuth, function (req, res) {
  if (req.session.loggedin) {
    res.render('check-orders', {
      reports: [],
      name: "",
    });
  }
  else {
    res.redirect('/');
  }
  res.end();
});

app.post('/add_order_id', checkAuth, function (req, res, next) {
  dbconn.query(`INSERT INTO filter_orderids (orders_id) VALUES ("${req.body.orders_id}")`, function (err, result) {
    if (err) throw err
    dbconn.query(sqlQueries.query.getOrdersIds, function (err, result) {
      if (err) throw err
      req.flash('success', 'Data stored!')
      res.redirect('/duplicate-tracking');
    })
  })
})

app.get('/delete-order-id', checkAuth, function (req, res) {
  var sqlDeleteQuery = `DELETE FROM filter_orderids WHERE orders_id=${req.query.orderId}`;
  dbconn.query(sqlDeleteQuery, function (err, result) {
    if (err) throw err
    req.flash('error', 'Data deleted!')
    res.redirect('/duplicate-tracking');
  })
});

app.post('/update-missing-order', checkAuth, function (req, res) {
  var sqlDeleteQuery = `UPDATE stores SET allowed_missing_orders = ${req.body.missingNumber} WHERE store_id = ${req.body.id}`;
  dbconn.query(sqlDeleteQuery, function (err, result) {
    if (err) throw err
    req.flash('success', 'Data updated!')
    res.redirect('/stores-list');
  })
});

// Orders List Page
app.get("/orders-export", checkAuth, (req, res) => {
  res.render('order-export', {
    title: 'Service Point',
    orderFileLink: '',
    productFileLink: '',
  });
});

// export orders csv
app.get('/api/convertcsv', checkAuth, convertcsv);

// download orders zip
app.get('/download-orders-list/:filename?', checkAuth, function (req, res) {
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

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = app;
