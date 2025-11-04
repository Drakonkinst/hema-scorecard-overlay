import type { MatchUpdate } from "../utils/matchStateTypes";
import type { GetStreamOverlayInfoResponse, NewExchangeResponse } from "./apiTypes";
import type { MatchInfo } from "../utils/matchStateTypes";

export const parseOverlayInfo = (data: GetStreamOverlayInfoResponse): MatchInfo => {
    return {
        tournamentName: data.tournamentName,
        fighter1: {
            name: data.fighter1Name,
            school: data.fighter1School ?? undefined,
            score: parseInt(data.fighter1Score),
            backgroundColor: data.color1Code,
            textColor: data.color1Contrast
        },
        fighter2: {
            name: data.fighter2Name,
            school: data.fighter2School ?? undefined,
            score: parseInt(data.fighter2Score),
            backgroundColor: data.color2Code,
            textColor: data.color2Contrast
        },
        doubles: parseInt(data.doubles),
        matchTime: parseInt(data.matchTime ?? '0'),
        lastExchangeId: data.lastExchange.toString()
    };
};

export const parseNewExchangeResponse = (data: NewExchangeResponse): MatchUpdate => {
    if (data.refresh) {
        return {
            needsRefresh: true,
            matchTime: null
        };
    };
    const matchTime = parseInt(data.matchTime ?? '0');
    if (!isNaN(matchTime)) {
        return {
            needsRefresh: false,
            matchTime
        };
    }
    throw new Error(`Could not parse NewExchangeResponse ${JSON.stringify(data)}`);
};

