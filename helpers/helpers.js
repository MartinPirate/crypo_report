"use strict";
exports.__esModule = true;
exports.createURL = exports.processDate = exports.processResponse = void 0;
var config_1 = require("../utils/config");
/**
 * Process the response to a simple JSON
 * @param response
 */
function processResponse(response) {
    var nestedArray = Array.from(response.entries());
    return nestedArray.reduce(function (obj, _a) {
        var key = _a[0], value = _a[1];
        obj[key] = value;
        return obj;
    }, {});
}
exports.processResponse = processResponse;
/**
 * Process Date input
 * @param dateString
 */
function processDate(dateString) {
    /*
        let token_date = moment(dateString).format("YYYY-MM-DD");
    */
    var date = new Date(dateString);
    var timestamp = date.getTime();
    return timestamp;
}
exports.processDate = processDate;
/**
 * Build the URL
 * @param symbolValue
 * @param dateValue
 */
function createURL(symbolValue, dateValue) {
    var params = {
        symbol: symbolValue,
        timestamp: dateValue
    };
    return config_1.apiUrl.replace(/{(\w+)}/g, function (match, name) {
        return params[name] || match;
    });
}
exports.createURL = createURL;
