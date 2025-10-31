import { getOverlaySettings } from "../utils/database";
import { GetStreamOverlayInfoResponseSchema, NewExchangeResponseSchema, type GetStreamOverlayInfoResponse, type NewExchangeResponse } from "./apiTypes";

const VIDEO_STREAM_MATCH = 1;

export enum ApiStatus {
    OK = "Ok",
    NETWORK_ERROR = "NetworkError",
    API_ERROR = "ApiError",
    PARSING_ERROR = "ParsingError"
}

interface ApiResponseError {
    error: ApiStatus;
    message?: string;
};

interface ApiResponseData<T> {
    data: T;
}

export type ApiResponse<T> = ApiResponseError | ApiResponseData<T>;

// Query newExchange which is a lightweight check returning the current
// match time, and whether an exchange has been updated (which causes
// a full refresh instead)
export const checkNeedsRefresh = async (matchId: string, lastExchangeId: string): Promise<ApiResponse<NewExchangeResponse>> => {
    const endpoint = `includes/functions/AJAX.php?mode=newExchange&matchID=${matchId}&exchangeID=${lastExchangeId}`;
    const url = wrapEndpoint(endpoint);

    let response: Response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error while calling checkNeedsRefresh";
        return { error: ApiStatus.NETWORK_ERROR, message: errorMsg };
    }

    if (!response.ok) {
        const errorMsg = `API call to newExchange failed (status code ${response.status})`;
        return { error: ApiStatus.API_ERROR, message: errorMsg };
    }

    try {
        const data = NewExchangeResponseSchema.parse(await response.json());
        return { data };
    } catch(error) {
        const errorMsg = error instanceof Error ? error.message : "Error during input validation";
        return { error: ApiStatus.PARSING_ERROR, message: errorMsg };
    }
};

// Queries getStreamOverlayInfo which grabs a bunch of useful data
// Currently we are presenting to be VIDEO_STREAM_MATCH via the
// streamMode option
export const queryScorecardOverlayInfo = async (matchId: string, lastExchangeId: string): Promise<ApiResponse<GetStreamOverlayInfoResponse>> => {
    const endpoint = `includes/functions/AJAX.php?mode=getStreamOverlayInfo&streamMode=${VIDEO_STREAM_MATCH}&lastExchange=${lastExchangeId}&identifier=${matchId}&synchTime=0&synchTime2=0&videoTime=0`;
    const url = wrapEndpoint(endpoint);
    let response: Response;

    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    } catch(error) {
        const errorMsg = error instanceof Error ? error.message : "Error while calling getStreamOverlayInfo";
        return { error: ApiStatus.NETWORK_ERROR, message: errorMsg };
    }
    if (!response.ok) {
        const errorMsg = `API call to getStreamOverlayInfo failed (status code ${response.status})`;
        return { error: ApiStatus.API_ERROR, message: errorMsg };
    }
    try {
        const data = GetStreamOverlayInfoResponseSchema.parse(await response.json());
        return { data };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error during input validation";
        return { error: ApiStatus.PARSING_ERROR, message: errorMsg };
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