import { checkNeedsRefresh } from "./scorecardApi";

console.log("Making API call...");
console.log(await checkNeedsRefresh("281070", "0"));