const DecodeData = require('../helpers/decode_data');
const fs = require('fs');
const { zip } = require('zip-a-folder');
var rimraf = require("rimraf");
const mail_helper = require('../helpers/email_helper');

const currentDateTime = () => {
    // get current date
    var today = new Date();
    var day = ("0" + today.getDate()).slice(-2);
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var year = today.getFullYear();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var date = day + "-" + month + "-" + year + "_" + hour + "_" + minutes + "_" + seconds;
    return date
}

async function genCsvToZip(zipFileDir, filename) {
    console.log('start converting to zip', currentDateTime());
    if (!fs.existsSync(zipFileDir)) {
        fs.mkdirSync(zipFileDir);
    }

    await zip('./ordersTodaycsv', `${zipFileDir}/${filename}.zip`);

    rimraf('./temp', function () {
        mail_helper.send_mail();
        console.log('Done!', currentDateTime());
    });
    // delete csv file
    // const result = findRemoveSync('./orderscsv', { extensions: ['.csv'] })
}

const genOrdersArr = (ArrData) => {
    var myArr = new Array();
    for (var i = 0; i < ArrData.length; i++) {
        var row = ArrData[i];

        var orderDetails = {
            "S.No.": i + 1,
            "Order ID": row['Order ID'],
            "OrderDetail ID": row['OrderDetail ID'],
            "Order Number": row['Order Number'],
            "Order Status": DecodeData.replaceOrderStatus(row['Order Status']),
            "Order Financial Status": row['Order Financial Status'],
            "Store Name": DecodeData.deAccentData(row['Store Name']),
            "Product Name": DecodeData.deAccentData(row['Product Name']),
            "Product Variant": DecodeData.deAccentData(row['Product Variant']),
            "shopify_order_detail_id": row['shopify_order_detail_id'],
            "admin_graphql_api_id": DecodeData.deAccentData(row['admin_graphql_api_id']),
            "fulfillable_quantity": row['fulfillable_quantity'],
            "IOSS Number": DecodeData.deAccentData(row['IOSS Number']) ? DecodeData.deAccentData(row['IOSS Number']) : '0000',
            "Product Image Link": DecodeData.deAccentData(row['Product Image Link']),
            "Link of Product Page": DecodeData.deAccentData(row['Link of Product Page']),
            "Product Id and Variant Name": DecodeData.deAccentData(row['Product Id and Variant Name']),
            "Gift Card": row['Gift Card'],
            "Grams/gm": row['Grams/gm'],
            "Price": DecodeData.changeAmountFormat(row['Price']),
            "Shopify Product ID": row['Shopify Product ID'],
            "Quantity": row['Quantity'],
            "SKU": DecodeData.deAccentData(row['SKU']),
            "Total Discount": row['Total Discount'],
            "shopify_variant_id": row['shopify_variant_id'],
            "account_details_id": row['account_details_id'],
            "quotation_id": row['quotation_id'],
            "supplier_account_details_id": row['supplier_account_details_id'],
            "supplier name": DecodeData.deAccentData(row['supplier name']),
            "quote_price": DecodeData.changeAmountFormat(row['quote_price']),
            "is_amount_deducted": row['is_amount_deducted'],
            "is_exchange_order": row['is_exchange_order'],
            "is_shipped": row['is_shipped'],
            "Customer Name": DecodeData.deAccentData(row['Customer Name']),
            "Paid by shop owner": row['Paid by shop owner'],
            "Date of payment": DecodeData.deAccentData(row['Date of payment']),
            "Customer Phone Number": DecodeData.deAccentData(row['Customer Phone Number']),
            "Customer Email": DecodeData.deAccentData(row['Customer Email']),
            "Address1": DecodeData.deAccentData(row['Address1']),
            "Address2": DecodeData.deAccentData(row['Address2']),
            "City": DecodeData.deAccentData(row['City']),
            "Province": DecodeData.deAccentData(row['Province']),
            "Province Code": DecodeData.deAccentData(row['Province Code']),
            "Country": DecodeData.deAccentData(row['Country']),
            "Country Code": DecodeData.deAccentData(row['Country Code']),
            "Zip Code": DecodeData.deAccentData(row['Zip Code']),
            "Company": DecodeData.deAccentData(row['Company']),
            "latitude": DecodeData.deAccentData(row['latitude']),
            "longitude": DecodeData.deAccentData(row['longitude']),
            "Intransit Date": (row['Intransit Date'] == '-' || row['Intransit Date'] == '00-00-0000') ? '' : row['Intransit Date'],
            "Max Processing Time": DecodeData.deAccentData(row['Max Processing Time']),
            "Max Delievery Time": DecodeData.deAccentData(row['Max Delievery Time']),
            "Admin supplier name": DecodeData.deAccentData(row['Admin supplier name']),
            "Agent support name": DecodeData.deAccentData(row['Agent support name']),
            "order_tracking_number": DecodeData.deAccentData(row['order_tracking_number']),
            "Order Created Date": row['Order Created Date'],
            "Order Processing Date": DecodeData.deAccentData(row['Order Processing Date']),
            "Client Name": DecodeData.deAccentData(row['Client Name']),
            "Fee/Order": DecodeData.changeAmountFormat(row['Fee/Order']),
            "Affiliate Fee": DecodeData.changeAmountFormat(row['Affiliate Fee']),
            "Agent Fee": DecodeData.changeAmountFormat(row['Agent Fee']),
            "Store Id": row['Store Id'],
        };
        myArr.push(orderDetails);
    }
    return myArr
}

const csvHeaderArr = [
    { id: 'S.No.', title: 'S.No.' },
    { id: 'Order ID', title: 'Order ID' },
    { id: 'OrderDetail ID', title: 'OrderDetail ID' },
    { id: 'Order Number', title: 'Order Number' },
    { id: 'Order Status', title: 'Order Status' },
    { id: 'Order Financial Status', title: 'Order Financial Status' },
    { id: 'Store Name', title: 'Store Name' },
    { id: 'Product Name', title: 'Product Name' },
    { id: 'Product Variant', title: 'Product Variant' },
    { id: 'shopify_order_detail_id', title: 'shopify_order_detail_id' },
    { id: 'admin_graphql_api_id', title: 'admin_graphql_api_id' },
    { id: 'fulfillable_quantity', title: 'fulfillable_quantity' },
    { id: 'IOSS Number', title: 'IOSS Number' },
    { id: 'Product Image Link', title: 'Product Image Link' },
    { id: 'Link of Product Page', title: 'Link of Product Page' },
    { id: 'Product Id and Variant Name', title: 'Product Id and Variant Name' },
    { id: 'Gift Card', title: 'Gift Card' },
    { id: 'Grams/gm', title: 'Grams/gm' },
    { id: 'Price', title: 'Price' },
    { id: 'Shopify Product ID', title: 'Shopify Product ID' },
    { id: 'Quantity', title: 'Quantity' },
    { id: 'SKU', title: 'SKU' },
    { id: 'Total Discount', title: 'Total Discount' },
    { id: 'shopify_variant_id', title: 'shopify_variant_id' },
    { id: 'account_details_id', title: 'account_details_id' },
    { id: 'quotation_id', title: 'quotation_id' },
    { id: 'supplier_account_details_id', title: 'supplier_account_details_id' },
    { id: 'supplier name', title: 'supplier name' },
    { id: 'quote_price', title: 'quote_price' },
    { id: 'is_amount_deducted', title: 'is_amount_deducted' },
    { id: 'is_exchange_order', title: 'is_exchange_order' },
    { id: 'is_shipped', title: 'is_shipped' },
    { id: 'Customer Name', title: 'Customer Name' },
    { id: 'Paid by shop owner', title: 'Paid by shop owner' },
    { id: 'Date of payment', title: 'Date of payment' },
    { id: 'Customer Phone Number', title: 'Customer Phone Number' },
    { id: 'Customer Email', title: 'Customer Email' },
    { id: 'Address1', title: 'Address1' },
    { id: 'Address2', title: 'Address2' },
    { id: 'City', title: 'City' },
    { id: 'Province', title: 'Province' },
    { id: 'Province Code', title: 'Province Code' },
    { id: 'Country', title: 'Country' },
    { id: 'Country Code', title: 'Country Code' },
    { id: 'Zip Code', title: 'Zip Code' },
    { id: 'Company', title: 'Company' },
    { id: 'latitude', title: 'latitude' },
    { id: 'longitude', title: 'longitude' },
    { id: 'Intransit Date', title: 'Intransit Date' },
    { id: 'Max Processing Time', title: 'Max Processing Time' },
    { id: 'Max Delievery Time', title: 'Max Delievery Time' },
    { id: 'Admin supplier name', title: 'Admin supplier name' },
    { id: 'Agent support name', title: 'Agent support name' },
    { id: 'order_tracking_number', title: 'order_tracking_number' },
    { id: 'Order Created Date', title: 'Order Created Date' },
    { id: 'Order Processing Date', title: 'Order Processing Date' },
    { id: 'Client Name', title: 'Client Name' },
    { id: 'Fee/Order', title: 'Fee/Order' },
    { id: 'Affiliate Fee', title: 'Affiliate Fee' },
    { id: 'Agent Fee', title: 'Agent Fee' },
    { id: 'Store Id', title: 'Store Id' }
];




module.exports = { currentDateTime, genOrdersArr, genCsvToZip, csvHeaderArr }