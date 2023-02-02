import {Transaction} from "./types";

const fs = require('fs');
const csv = require('csv-parser');

const signale = require('signale');

import {program} from "commander";
import TokenService from "./services/token-service";
import {processResponse} from "./helpers/helpers";
import {isValidTokenSymbol} from "./helpers/errorHandler";


let results: Array<Transaction> = [];

const portfolioService = new TokenService;

let count = 0;


const stream = fs.createReadStream("data/transactions.csv")
    .pipe(csv())
    .on("data",
        (data: Transaction) => {
            results.push(data);
            count++;
            if (count >= 10000) {
                stream.destroy();

            }
        });

stream.on("close", async () => {
    program
        .version("0.1.0")
        .option("-t, --token <token>", "Token eg BTC")
        .option("-d, --date <date>", "Date eg 2021-12-08")
        .parse(process.argv);

    let opts = program.opts();

    //both date and symbol are passed
    if (opts.token && opts.date) {

        if (isValidTokenSymbol(opts.token)) {
            signale.info(`Loading Token Value of ${opts.token} on date ${opts.date} in USD \n`);

            let token_value_on_date = await portfolioService.getTokenValueByDate(
                opts.date,
                opts.token,
                results
            );
            let response = processResponse(token_value_on_date);
            signale.success(`Token key-value for ${opts.token} on ${opts.date} is\n `);
            console.log(response)

        } else {

            throw new Error(`${opts.token} is an invalid Symbol`);
        }

        //only date args provided

    } else if (opts.date) {
        signale.info(` Loading Token Value on date ${opts.date} in USD  `);
        let by_date_token_value = processResponse(await portfolioService.getTokensValueByDate(
            opts.date,
            results
        ));
        signale.success('Token Values Loaded Successfully');
        console.log(
            by_date_token_value
        );


        //only symbol is provided

    } else if (opts.token) {

        signale.info(` Loading Token Value for ${opts.token} in USD:`);
        let token_value = await portfolioService.getLatestTokenValueBySymbol(
            opts.token,
            results
        );
        signale.success(`Latest Token Value for ${opts.token} is  $${token_value}\n`);

    }
    //default

    else {
        signale.info("Loading Latest Prices for all available  Tokens");
        let response = processResponse(await portfolioService.getLatestTokensValueInUsd(results));
        signale.success('Token Values Loaded Successfully');
        console.log(response)
    }
});