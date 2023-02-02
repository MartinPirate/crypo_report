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
var fs = require('fs');
var csv = require('csv-parser');
var signale = require('signale');
var commander_1 = require("commander");
var token_service_1 = require("./services/token-service");
var helpers_1 = require("./helpers/helpers");
var errorHandler_1 = require("./helpers/errorHandler");
var results = [];
var portfolioService = new token_service_1["default"];
var count = 0;
var stream = fs.createReadStream("data/transactions.csv")
    .pipe(csv())
    .on("data", function (data) {
    results.push(data);
    count++;
    if (count >= 10000) {
        stream.destroy();
    }
});
stream.on("close", function () { return __awaiter(void 0, void 0, void 0, function () {
    var opts, token_value_on_date, response, by_date_token_value, _a, token_value, response, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                commander_1.program
                    .version("0.1.0")
                    .option("-t, --token <token>", "Token eg BTC")
                    .option("-d, --date <date>", "Date eg 2021-12-08")
                    .parse(process.argv);
                opts = commander_1.program.opts();
                if (!(opts.token && opts.date)) return [3 /*break*/, 4];
                if (!(0, errorHandler_1.isValidTokenSymbol)(opts.token)) return [3 /*break*/, 2];
                signale.info("Loading Token Value of ".concat(opts.token, " on date ").concat(opts.date, " in USD \n"));
                return [4 /*yield*/, portfolioService.getTokenValueByDate(opts.date, opts.token, results)];
            case 1:
                token_value_on_date = _c.sent();
                response = (0, helpers_1.processResponse)(token_value_on_date);
                signale.success("Token key-value for ".concat(opts.token, " on ").concat(opts.date, " is\n "));
                console.log(response);
                return [3 /*break*/, 3];
            case 2: throw new Error("".concat(opts.token, " is an invalid Symbol"));
            case 3: return [3 /*break*/, 10];
            case 4:
                if (!opts.date) return [3 /*break*/, 6];
                signale.info(" Loading Token Value on date ".concat(opts.date, " in USD  "));
                _a = helpers_1.processResponse;
                return [4 /*yield*/, portfolioService.getTokensValueByDate(opts.date, results)];
            case 5:
                by_date_token_value = _a.apply(void 0, [_c.sent()]);
                signale.success('Token Values Loaded Successfully');
                console.log(by_date_token_value);
                return [3 /*break*/, 10];
            case 6:
                if (!opts.token) return [3 /*break*/, 8];
                signale.info(" Loading Token Value for ".concat(opts.token, " in USD:"));
                return [4 /*yield*/, portfolioService.getLatestTokenValueBySymbol(opts.token, results)];
            case 7:
                token_value = _c.sent();
                signale.success("Latest Token Value for ".concat(opts.token, " is  $").concat(token_value, "\n"));
                return [3 /*break*/, 10];
            case 8:
                signale.info("Loading Latest Prices for all available  Tokens");
                _b = helpers_1.processResponse;
                return [4 /*yield*/, portfolioService.getLatestTokensValueInUsd(results)];
            case 9:
                response = _b.apply(void 0, [_c.sent()]);
                signale.success('Token Values Loaded Successfully');
                console.log(response);
                _c.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
