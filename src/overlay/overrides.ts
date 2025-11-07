import { getMatchOverrides } from "../utils/database"
import type { MatchInfo, PartialMatchInfo } from "../utils/matchStateTypes"

export const applyMatchOverrides = (matchInfo: MatchInfo): MatchInfo => {
    const overrides: PartialMatchInfo = getMatchOverrides();
    // Make a deep copy
    return {
        tournamentName: overrides.tournamentName ?? matchInfo.tournamentName,
        fighter1: {
            name: overrides.fighter1?.name ?? matchInfo.fighter1.name,
            school: overrides.fighter1?.school ?? matchInfo.fighter1.school,
            score: overrides.fighter1?.score ?? matchInfo.fighter1.score,
            backgroundColor: overrides.fighter1?.backgroundColor ?? matchInfo.fighter1.backgroundColor,
            textColor: overrides.fighter1?.textColor ?? matchInfo.fighter1.textColor,
        },
        fighter2: {
            name: overrides.fighter2?.name ?? matchInfo.fighter2.name,
            school: overrides.fighter2?.school ?? matchInfo.fighter2.school,
            score: overrides.fighter2?.score ?? matchInfo.fighter2.score,
            backgroundColor: overrides.fighter2?.backgroundColor ?? matchInfo.fighter2.backgroundColor,
            textColor: overrides.fighter2?.textColor ?? matchInfo.fighter2.textColor,
        },
        doubles: overrides.doubles ?? matchInfo.doubles,
        matchTime: overrides.matchTime ?? matchInfo.matchTime,
        lastExchangeId: matchInfo.lastExchangeId, // Never override lastExchangeId
    };
}