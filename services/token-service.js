"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var moment = require('moment');
var exchange_service_1 = require("./exchange-service");
var errorHandler_1 = require("../helpers/errorHandler");
var TokenService = /** @class */ (function () {
    function TokenService() {
    }
    /**
     * Get sum of the all Tokens
     * @param tokensMap
     * @param items
     * @param token
     */
    TokenService.prototype.getTokenAmount = function (tokensMap, items, token) {
        items.map(function (item) {
            if (item.token !== "" && item.token !== undefined) {
                var balance = tokensMap.get(item.token) || 0;
                /*  balance = item.transaction_type === "DEPOSIT" ? balance + item.amount : (item.transaction_type === "WITHDRAWAL" ? balance - item.amount : balance) */
                if (item.transaction_type === "DEPOSIT") {
                    balance = Number(balance) + Number(item.amount);
                }
                else if (item.transaction_type === "WITHDRAWAL") {
                    balance = Number(balance) - Number(item.amount);
                }
                tokensMap.set(item.token, balance);
            }
        });
        return tokensMap;
    };
    /**
     * FixMe getTokenAmount() overloaded with a nullable token_symbol parameter
     * @param total_value_map
     * @param transactions
     * @param token_symbol
     */
    TokenService.prototype.getTotalsToken = function (total_value_map, transactions, token_symbol) {
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var transaction = transactions_1[_i];
            if (transaction.token === token_symbol) {
                var balance = total_value_map.get(transaction.token) || 0;
                if (transaction.transaction_type === "DEPOSIT") {
                    balance = Number(balance) + Number(transaction.amount);
                }
                else if (transaction.transaction_type === "WITHDRAWAL") {
                    balance = Number(balance) - Number(transaction.amount);
                }
                total_value_map.set(transaction.token, balance);
            }
        }
        return total_value_map;
    };
    TokenService.prototype.getLatestTokenValueBySymbol = function (token_symbol, transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var token_map, value, date, token_date, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token_map = new Map();
                        token_map = this.getTotalsToken(token_map, transactions, token_symbol);
                        value = token_map.get(token_symbol) || 0;
                        date = new Date();
                        token_date = moment(date).format("YYYY-MM-DD");
                        return [4 /*yield*/, (0, exchange_service_1.getTokensExchangeRate)(token_symbol, token_date)];
                    case 1:
                        amount = _a.sent();
                        return [2 /*return*/, value * amount];
                }
            });
        });
    };
    TokenService.prototype.getTokenValueByDate = function (date, token, transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var token_map;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token_map = new Map();
                        token_map = this.getTotalsToken(token_map, transactions, token);
                        return [4 /*yield*/, this.getExchangeRateForToken(token_map, date)];
                    case 1:
                        token_map = _a.sent();
                        return [2 /*return*/, token_map];
                }
            });
        });
    };
    TokenService.prototype.getExchangeRateForToken = function (exchange_rates, date) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, token_symbol, value, token_date, exchangeRate;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = Array.from(exchange_rates.entries());
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], token_symbol = _b[0], value = _b[1];
                        if (date !== null && date !== undefined) {
                            if (!(0, errorHandler_1.isValidDateFormat)(date)) {
                                throw new Error("Invalid date format, expected \"yyyy-MM-dd\", got ".concat(date));
                            }
                        }
                        token_date = moment(date).format("YYYY-MM-DD");
                        return [4 /*yield*/, (0, exchange_service_1.getTokensExchangeRate)(token_symbol, token_date)];
                    case 2:
                        exchangeRate = _c.sent();
                        exchange_rates.set(token_symbol, value * exchangeRate);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, exchange_rates];
                }
            });
        });
    };
    TokenService.prototype.getLatestTokensValueInUsd = function (transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var latest_tokens_value_map;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        latest_tokens_value_map = new Map();
                        latest_tokens_value_map = this.getTokenAmount(latest_tokens_value_map, transactions);
                        return [4 /*yield*/, this.getExchangeRateForToken(latest_tokens_value_map)];
                    case 1:
                        latest_tokens_value_map = _a.sent();
                        return [2 /*return*/, latest_tokens_value_map];
                }
            });
        });
    };
    TokenService.prototype.getTokensValueByDate = function (date, transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens_map;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokens_map = new Map();
                        tokens_map = this.getTokenAmount(tokens_map, transactions);
                        return [4 /*yield*/, this.getExchangeRateForToken(tokens_map, date)];
                    case 1:
                        tokens_map = _a.sent();
                        return [2 /*return*/, tokens_map];
                }
            });
        });
    };
    return TokenService;
}());
exports["default"] = TokenService;
