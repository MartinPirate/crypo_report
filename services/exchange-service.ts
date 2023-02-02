import {createURL, processDate} from "../helpers/helpers";

const request = require('request');

export function getTokensExchangeRate(symbol: string, date: string): Promise<number> {
    let timestamp = processDate(date);
    let url = createURL(symbol, timestamp);
    return new Promise((resolve, reject) => {
        request(
            url,
            (error: any, response: any, body: string) => {
                if (error) {
                    reject(error);
                } else {
                    let data = JSON.parse(body).USD;
                    resolve(data);
                }
            }
        );
    });
}
