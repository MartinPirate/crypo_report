## simple crypo report generator

# my approach

## languages

- Node/Typescript

## data

- Only Loading the first 10k records using a csv-parser library

- for validation we only allow the tokens ``["BTC", "ETH", "XRP"]``

- ESLint ignored 🤫️🤫️🤫️️
- Out of the box  `tsconfig.json` configurations
- No unit tests 😂️

# How to run the code

- Clone the repo ` git@github.com:MartinPirate/crypo_report.git`
- copy the `trasactions.csv` file  from`https://github.com/Nparooei/Propine/tree/develop/data` to the data directory (too huge to commit 😂️)
- Run `npm install` to install the dependencies
- Run `tsc server.ts`  typescript compilation
- Run `npm run start  ` for option 1 - no params

```
ℹ  info      Loading Latest Prices for all available  Tokens

✔  success   Token Values Loaded Successfully
{ 
BTC: 7134.658874, 
ETH: 317.4383764800001,
XRP: 0.2861133544
}
```

- Run `node server.js -t -t <token> ` for option 2 - using a Token Symbol eg  `node server.js -t "BTC"`

```
ℹ  info       Loading Token Value for BTC in USD:
✔  success   Latest Token Value for BTC is  $7138.517561199999

ℹ  info       Loading Token Value for ETH in USD:
✔  success   Latest Token Value for ETH is  $317.7116899200001 

ℹ  info       Loading Token Value for XRP in USD:
✔  success   Latest Token Value for XRP is  $0.286321336 


```

- Run `node server.js -d <date> ` for option 3 given a date eg `node server.js -d 2019-10-19`

```
ℹ  info       Loading Token Value on date 2019-10-19 in USD  
✔  success   Token Values Loaded Successfully

{ 
BTC: 7139.7241476,
ETH: 317.9831053500001,
XRP: 0.2867372992 
}


```

- Run `npm run start -t <token> -d <date> ` option 3, given a token symbol and a date
  eg `node server.js -t "BTC" -d 2019-10-19`

```ℹ  info      Loading Token Value of BTC on date 2019-10-19 in USD  
ℹ  info      Loading Token Value of BTC on date 2019-10-19 in USD 
✔  success   Token key-value for BTC on 2019-10-19 is

{ BTC: 7138.547427199999 }


ℹ  info      Loading Token Value of ETH on date 2019-10-19 in USD 
✔  success   Token key-value for ETH on 2019-10-19 is
 
{ ETH: 317.6205854400001 }


ℹ  info      Loading Token Value of XRP on date 2019-10-19 in USD 
✔  success   Token key-value for XRP on 2019-10-19 is
 
{ XRP: 0.2872225896 }
```

