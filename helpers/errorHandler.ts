/**
 * validate date passed
 * @param date
 */
export function isValidDateFormat(date?: any) {

    /*    if (date !== null && date !== undefined) {
            return true;
        }*/

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);

}

export function isValidTokenSymbol(token: String | null) {
    if (!token) {
        return true;
    }
    return ["BTC", "ETH", "XRP"].includes(token);
}