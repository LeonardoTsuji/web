import * as queryString from "query-string";

const urlParams = queryString.parse(window.location.search);

console.log(`The code is: ${urlParams.code}`);

export default urlParams;
