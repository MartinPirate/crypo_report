import {apiUrl} from "../utils/config";

/**
 * Process the response to a simple JSON
 * @param response
 */
export function processResponse(response: Map<string, number>) {
    let nestedArray = Array.from(response.entries());
    return nestedArray.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {})
}


/**
 * Process Date input
 * @param dateString
 */
export function processDate(dateString: string | number | Date) {

/*
    let token_date = moment(dateString).format("YYYY-MM-DD");
*/
    const date: Date = new Date(dateString);
    const timestamp: number = date.getTime();
    return timestamp
}

/**
 * Build the URL
 * @param symbolValue
 * @param dateValue
 */
export function createURL(symbolValue: any, dateValue: any) {
    const params = {
        symbol: symbolValue,
        timestamp: dateValue
    };

    return apiUrl.replace(/{(\w+)}/g, (match, name) => {
        return params[name] || match;
    });

}
