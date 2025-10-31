import type { MatchUpdate } from "../utils/matchStateTypes";
import type { GetStreamOverlayInfoResponse, NewExchangeResponse } from "./apiTypes";
import type { MatchInfo } from "../utils/matchStateTypes";
import { getOverlaySettings } from "../utils/database";

const SECONDS_PER_MINUTE = 60;

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
        matchTime: timeToStr(parseInt(data.matchTime)),
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
    if (data.matchTime != null) {
        const currentMatchTime = parseInt(data.matchTime);
        if (currentMatchTime > 0) {
            return {
                needsRefresh: false,
                matchTime: timeToStr(currentMatchTime)
            };
        }
    }
    throw new Error(`Could not parse NewExchangeResponse ${data}`);
}

export const timeToStr = (time: number) => {
    const minutes = Math.floor(time / SECONDS_PER_MINUTE);
    const seconds = Math.floor(time % SECONDS_PER_MINUTE);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const doublesToStr = (doubles: number) => {
    let doubleStr = doubles.toString();
    const funMode = getOverlaySettings().funMode ?? true;
    if (!funMode) {
        return doubleStr;
    }
    if (doubles <= 0) {
        doubleStr += " :)";
    } else if (doubles === 2) {
        doubleStr += " :(";
    } else {
        for (let i = 2; i < Math.min(doubles, 9); ++i) {
            doubleStr += "!";
        }
    }
    return doubleStr;
};