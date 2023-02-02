"use strict";
exports.__esModule = true;
exports.getTokensExchangeRate = void 0;
var helpers_1 = require("../helpers/helpers");
var request = require('request');
function getTokensExchangeRate(symbol, date) {
    var timestamp = (0, helpers_1.processDate)(date);
    var url = (0, helpers_1.createURL)(symbol, timestamp);
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                reject(error);
            }
            else {
                var data = JSON.parse(body).USD;
                resolve(data);
            }
        });
    });
}
exports.getTokensExchangeRate = getTokensExchangeRate;
