"use strict";
exports.__esModule = true;
exports.isValidTokenSymbol = exports.isValidDateFormat = void 0;
/**
 * validate date passed
 * @param date
 */
function isValidDateFormat(date) {
    /*    if (date !== null && date !== undefined) {
            return true;
        }*/
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
}
exports.isValidDateFormat = isValidDateFormat;
function isValidTokenSymbol(token) {
    if (!token) {
        return true;
    }
    return ["BTC", "ETH", "XRP"].includes(token);
}
exports.isValidTokenSymbol = isValidTokenSymbol;
