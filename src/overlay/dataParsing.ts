import type { MatchUpdate } from "../utils/matchStateTypes";
import type { GetStreamOverlayInfoResponse, NewExchangeResponse } from "./apiTypes";
import type { MatchInfo } from "../utils/matchStateTypes";

export const parseOverlayInfo = (data: GetStreamOverlayInfoResponse): MatchInfo => {
    return {
        tournamentName: data.tournamentName,
        fighter1: {
            name: data.fighter1Name,
            school: data.fighter1School ?? undefined,
            score: parseIntOrNaN(data.fighter1Score, 0),
            backgroundColor: data.color1Code,
            textColor: data.color1Contrast,
        },
        fighter2: {
            name: data.fighter2Name,
            school: data.fighter2School ?? undefined,
            score: parseIntOrNaN(data.fighter2Score, 0),
            backgroundColor: data.color2Code,
            textColor: data.color2Contrast,
        },
        doubles: parseInt(data.doubles),
        matchTime: parseInt(data.matchTime ?? '0'),
        lastExchangeId: data.lastExchange.toString(),
    };
};

const parseIntOrNaN = (integerStr: string, valueIfNan: number): number => {
    const value = parseInt(integerStr);
    if (isNaN(value)) {
        return valueIfNan;
    }
    return value;
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

