"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const csvFile = 'data/transactions.csv';
const apiUrl = 'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=USD';
const getExchangeRate = (symbol, cb) => {
    (0, request_1.default)(apiUrl.replace('{symbol}', symbol), (err, response, body) => {
        if (err)
            return cb(err);
        const data = JSON.parse(body);
        if (data.Response === 'Error')
            return cb(new Error(data.Message));
        cb(null, data.USD);
    });
};
fs_1.default.readFile(csvFile, 'utf8', (err, data) => {
    if (err)
        return console.error(err);
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const transactions = lines
        .slice(1)
        .map(line => line.split(','))
        .reduce((acc, fields) => {
        const transaction = headers.reduce((obj, header, i) => {
            obj[header] = fields[i];
            return obj;
        }, {});
        acc[transaction.token] = acc[transaction.token] || {
            symbol: transaction.token,
            balance: 0,
        };
        acc[transaction.token].balance +=
            transaction.transaction_type === 'DEPOSIT'
                ? Number(transaction.amount)
                : -Number(transaction.amount);
        return acc;
    }, {});
    const symbols = Object.keys(transactions);
    let remaining = symbols.length;
    symbols.forEach(symbol => {
        getExchangeRate(symbol, (err, rate) => {
            if (err)
                return console.error(err);
            transactions[symbol].balance *= rate;
            if (--remaining === 0) {
                console.log(symbols
                    .map(symbol => transactions[symbol])
                    .sort((a, b) => b.balance - a.balance)
                    .map(transaction => `${transaction.symbol}: ${transaction.balance.toFixed(2)} USD`)
                    .join('\n'));
            }
        });
    });
});
