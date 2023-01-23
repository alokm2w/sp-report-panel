var decode = require('html-entities-decoder');

function deAccentData(data)  {

    var str = decode(JSON.stringify(data));
    //replace double quotes from string (start and end)
    str = str.replace(/(^"|"$)/g, '');

    // replace semicolon(;) by (:)
    str = str.split(';').join(':');

    return (str == 'null') ? "" : str;
}

function replaceOrderStatus(status)  {

    const status_arr = [];
    status_arr[0] = "Not quoted";
    status_arr[1] = "Processing";
    status_arr[2] = "Fulfilled";
    status_arr[3] = "In transit";
    status_arr[4] = "Hold";
    status_arr[5] = "Cancelled";
    status_arr[6] = "Delayed";
    status_arr[7] = "Address error";
    status_arr[8] = "Waiting for tracking update";
    status_arr[9] = "Delivered";
    status_arr[10] = "Failed to deliver";
    status_arr[11] = "Stuck in transit";
    status_arr[17] = "Refund";
    status_arr[18] = "Resend";
    status_arr[13] = "Available for pick up";
    status_arr[15] = "Alert";

    return status_arr[status];
}

function replaceProductStatus(status)  {

    const status_arr = [];
    status_arr[0] = "Not quoted";
    status_arr[1] = "Awating quotation";
    status_arr[2] = "Bidding";
    status_arr[3] = "Quotation done";
    status_arr[4] = "Quotation accepted";
    status_arr[5] = "Quotation not accepted";
    status_arr[6] = "Stop fullfilment";
    status_arr[7] = "Requote - Bidding";
    status_arr[8] = "Add country";
    status_arr[9] = "New price";
    status_arr[10] = "New price rejected";
    status_arr[11] = "New variant";
    status_arr[12] = "Open special request";
    status_arr[13] = "Closed special request";

    var status = status_arr[status];

    return status;
}

function changeAmountFormat(amount)
{
    // check and convert number in a string
    var amount = (isNaN(amount) == false) ? amount.toString() : amount;
    return amount.replace('.',',');
}

module.exports = { deAccentData, replaceOrderStatus, replaceProductStatus, changeAmountFormat }