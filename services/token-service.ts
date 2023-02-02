import {Transaction} from "../types";

const moment = require('moment');
import {getTokensExchangeRate} from "./exchange-service";
import {isValidDateFormat} from "../helpers/errorHandler";


class TokenService {

    /**
     * Get sum of the all Tokens
     * @param tokensMap
     * @param items
     * @param token
     */
    getTokenAmount(tokensMap: Map<string, number>, items: Array<Transaction>, token?: string) {
        items.map(item => {
            if (item.token !== "" && item.token !== undefined) {
                let balance: number = tokensMap.get(item.token) || 0;
                /*  balance = item.transaction_type === "DEPOSIT" ? balance + item.amount : (item.transaction_type === "WITHDRAWAL" ? balance - item.amount : balance) */

                if (item.transaction_type === "DEPOSIT") {
                    balance = Number(balance) + Number(item.amount);
                } else if (item.transaction_type === "WITHDRAWAL") {
                    balance = Number(balance) - Number(item.amount);
                }

                tokensMap.set(item.token, balance);
            }
        });
        return tokensMap;
    }

    /**
     * FixMe getTokenAmount() overloaded with a nullable token_symbol parameter
     * @param total_value_map
     * @param transactions
     * @param token_symbol
     */
    getTotalsToken(total_value_map: Map<string, number>, transactions: Array<Transaction>, token_symbol: string) {
        for (const transaction of transactions) {
            if (transaction.token === token_symbol) {
                let balance: number = total_value_map.get(transaction.token) || 0;

                if (transaction.transaction_type === "DEPOSIT") {
                    balance = Number(balance) + Number(transaction.amount);
                } else if (transaction.transaction_type === "WITHDRAWAL") {
                    balance = Number(balance) - Number(transaction.amount);
                }

                total_value_map.set(transaction.token, balance);
            }
        }
        return total_value_map;
    }

    async getLatestTokenValueBySymbol(token_symbol: string, transactions: Array<Transaction>): Promise<number> {

        let token_map: Map<string, number> = new Map();
        token_map = this.getTotalsToken(token_map, transactions, token_symbol);

        let value = token_map.get(token_symbol) || 0;

        let date = new Date();
        let token_date = moment(date).format("YYYY-MM-DD");
        let amount = await getTokensExchangeRate(token_symbol, token_date);
        return value * amount;
    }

    async getTokenValueByDate(date: Date, token: string, transactions: Array<Transaction>): Promise<Map<string, number>> {
        let token_map: Map<string, number> = new Map();
        token_map = this.getTotalsToken(token_map, transactions, token);

        token_map = await this.getExchangeRateForToken(token_map, date);

        return token_map;
    }

    async getExchangeRateForToken(exchange_rates: Map<string, number>, date?: Date) {
        for (const [token_symbol, value] of Array.from(exchange_rates.entries())) {

            if (date !== null && date !== undefined) {
                if (!isValidDateFormat(date)) {
                    throw new Error(`Invalid date format, expected "yyyy-MM-dd", got ${date}`);
                }
            }

            let token_date = moment(date).format("YYYY-MM-DD");

            let exchangeRate: number = await getTokensExchangeRate(token_symbol, token_date);

            exchange_rates.set(token_symbol, value * exchangeRate);
        }
        return exchange_rates;
    }

    async getLatestTokensValueInUsd(transactions: Array<Transaction>): Promise<Map<string, number>> {
        let latest_tokens_value_map: Map<string, number> = new Map();

        latest_tokens_value_map = this.getTokenAmount(latest_tokens_value_map, transactions);


        latest_tokens_value_map = await this.getExchangeRateForToken(latest_tokens_value_map);

        return latest_tokens_value_map;
    }

    async getTokensValueByDate(date: Date, transactions: Array<Transaction>): Promise<Map<string, number>> {
        let tokens_map: Map<string, number> = new Map();

        tokens_map = this.getTokenAmount(tokens_map, transactions);

        tokens_map = await this.getExchangeRateForToken(tokens_map, date);

        return tokens_map;
    }


}


export default TokenService


