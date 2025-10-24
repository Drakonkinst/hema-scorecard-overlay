import { NewExchangeResponseSchema, type NewExchangeResponse } from "./types";

export const checkNeedsRefresh = async (matchId: string, lastExchangeId: string): Promise<NewExchangeResponse> => {
    const endpoint = `includes/functions/AJAX.php?mode=newExchange&matchID=${matchId}&exchangeID=${lastExchangeId}`;

    try {
        const response = await fetch(wrapEndpoint(endpoint), {
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
            matchTime: -1,
        }
    }
};

const wrapEndpoint = (endpoint: string) => {
    // To get around CORS issues, we can run a local proxy.
    // See: https://www.npmjs.com/package/local-cors-proxy
    if (window.location.hostname === 'localhost') {
        return `http://localhost:8010/proxy/${endpoint}`
    }
    return `https://hemascorecard.com/${endpoint}`
}