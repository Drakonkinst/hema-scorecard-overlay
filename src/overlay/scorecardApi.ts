import { NewExchangeResponse, type NewExchangeResponseType } from "./types";

export const checkNeedsRefresh = async (matchId: string, lastExchangeId: string): Promise<NewExchangeResponseType> => {
    const url = `https://hemascorecard.com/includes/functions/AJAX.php?mode=newExchange&matchID=${matchId}&exchangeID=${lastExchangeId}`;

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
        const data = NewExchangeResponse.parse(await response.json());
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