import type { GetStreamOverlayInfoResponse, NewExchangeResponse } from "./types";

const SECONDS_PER_MINUTE = 60;

export interface MatchInfo {
    tournamentName: string;
    fighter1: FighterInfo;
    fighter2: FighterInfo;
    doubles: string; // Display string
    matchTime: string; // Display string
    lastExchangeId: string;
};

interface FighterInfo {
    name: string;
    school?: string;
    score: number;
    backgroundColor?: string;
    textColor?: string;
};

export interface MatchUpdate {
    needsRefresh: boolean;
    matchTime: string | null;
}

export const getBlankMatchInfo = (): MatchInfo => {
    return {
        tournamentName: '',
        fighter1: {
            name: '',
            score: 0
        },
        fighter2: {
            name: '',
            score: 0
        },
        doubles: doublesToStr(0),
        matchTime: timeToStr(0),
        lastExchangeId: "-1"
    }
};

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
        doubles: doublesToStr(parseInt(data.doubles)),
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

const timeToStr = (time: number) => {
    const minutes = Math.floor(time / SECONDS_PER_MINUTE);
    const seconds = Math.floor(time % SECONDS_PER_MINUTE);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const doublesToStr = (doubles: number, numberOnly: boolean = false) => {
    let doubleStr = doubles.toString();
    if (numberOnly) {
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