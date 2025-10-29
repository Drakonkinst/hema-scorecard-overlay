import { doublesToStr, timeToStr } from "../overlay/dataParsing";

export interface FighterInfo {
    name: string;
    school?: string;
    score: number;
    backgroundColor?: string;
    textColor?: string;
};

export interface MatchUpdate {
    needsRefresh: boolean;
    matchTime: string | null;
};

export const getBlankMatchInfo = (): MatchInfo => {
    return {
        tournamentName: '',
        fighter1: {
            name: 'Fighter 1',
            school: '',
            score: 0
        },
        fighter2: {
            name: 'Fighter 2',
            school: '',
            score: 0
        },
        doubles: doublesToStr(0),
        matchTime: timeToStr(0),
        lastExchangeId: "-1"
    };
};
export interface MatchInfo {
    tournamentName: string;
    fighter1: FighterInfo;
    fighter2: FighterInfo;
    doubles: string; // Display string
    matchTime: string; // Display string
    lastExchangeId: string;
}
;

