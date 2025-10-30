import { getOverlaySettings } from "../utils/database";
import { GetStreamOverlayInfoResponseSchema, NewExchangeResponseSchema, type GetStreamOverlayInfoResponse, type NewExchangeResponse } from "./apiTypes";

const VIDEO_STREAM_MATCH = 1;

// Query newExchange which is a lightweight check returning the current
// match time, and whether an exchange has been updated (which causes
// a full refresh instead)
export const checkNeedsRefresh = async (matchId: string, lastExchangeId: string): Promise<NewExchangeResponse> => {
    const endpoint = `includes/functions/AJAX.php?mode=newExchange&matchID=${matchId}&exchangeID=${lastExchangeId}`;
    const url = wrapEndpoint(endpoint);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if (!response.ok) {
            throw new Error(`API call to newExchange failed (status code ${response.status})`);
        }
        const data = NewExchangeResponseSchema.parse(await response.json());
        return data;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error while calling checkNeedsRefresh";
        console.error(errorMsg);
        return {
            refresh: false,
            matchTime: "-1",
        }
    }
};

// Queries getStreamOverlayInfo which grabs a bunch of useful data
// Currently we are presenting to be VIDEO_STREAM_MATCH via the
// streamMode option
export const queryScorecardOverlayInfo = async (matchId: string, lastExchangeId: string): Promise<GetStreamOverlayInfoResponse|null> => {
    const endpoint = `includes/functions/AJAX.php?mode=getStreamOverlayInfo&streamMode=${VIDEO_STREAM_MATCH}&lastExchange=${lastExchangeId}&identifier=${matchId}&synchTime=0&synchTime2=0&videoTime=0`;
    const url = wrapEndpoint(endpoint);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if (!response.ok) {
            throw new Error(`API call to getStreamOverlayInfo failed (status code ${response.status})`);
        }
        const data = GetStreamOverlayInfoResponseSchema.parse(await response.json());
        return data;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error while calling getStreamOverlayInfo";
        console.error(errorMsg);
        return null;
    }

}

const wrapEndpoint = (endpoint: string) => {
    // To get around CORS issues, we can run a local proxy.
    // See: https://www.npmjs.com/package/local-cors-proxy
    if (window.location.hostname === 'localhost' || getOverlaySettings().useLocalCorsRouting) {
        return `http://localhost:8010/proxy/${endpoint}`
    }
    return `https://hemascorecard.com/${endpoint}`
}