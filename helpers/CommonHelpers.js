
// Get Unique Array
function removeDuplicateVal(array) {
    var outputArray = [];
    var count = 0;
    var start = false;

    for (j = 0; j < array.length; j++) {
        for (k = 0; k < outputArray.length; k++) {
            if (array[j] == outputArray[k]) {
                start = true;
            }
        }
        count++;
        if (count == 1 && start == false) {
            outputArray.push(array[j]);
        }
        start = false;
        count = 0;
    }
    return outputArray;
}


// Get Current Date
const currentDateTime = () => {
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

// Get given days back date
function getBackDate(days) {
    var prevDate = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));
    dd = prevDate.getDate();
    mm = prevDate.getMonth() + 1;
    yyyy = prevDate.getFullYear();
    HH = prevDate.getHours();
    MM = prevDate.getMinutes()
    SS = prevDate.getSeconds();
    return new Date(`${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`);
}

// Change Date Format
function formatDate(date) {
    const [dateValues, timeValues] = date.split(' ');
    const [day, month, year] = dateValues.split('-');
    const [hours, minutes, seconds] = timeValues.split(':');
    return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
}

// GroupBy Array of Objects
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

// remove null data
function removeEmptyValueFromArr(arr){
    var filtered = arr.filter(function (el) {
        return el != null;
    });

    return filtered;
}


module.exports = { removeDuplicateVal, currentDateTime, getBackDate, formatDate, groupBy, removeEmptyValueFromArr}