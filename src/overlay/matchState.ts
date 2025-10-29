import { parseNewExchangeResponse, parseOverlayInfo } from "./dataParsing";
import { getBlankMatchInfo, type MatchUpdate } from "../utils/matchStateTypes";
import { type MatchInfo } from "../utils/matchStateTypes";
import { checkNeedsRefresh, queryScorecardOverlayInfo } from "./scorecardApi";
import type { GetStreamOverlayInfoResponse, NewExchangeResponse } from "./apiTypes";

export class MatchState {
    private readonly _matchId: string;
    private _matchInfo: MatchInfo;

    constructor(matchId?: string) {
        this._matchId = matchId ?? '';
        this._matchInfo = getBlankMatchInfo();
    }

    public async updateMatch(): Promise<void> {
        // Do no queries if it the match ID is blank
        if (!this._matchId) {
            return;
        }

        const matchUpdate: MatchUpdate | null = await this.queryMatchUpdate();

        if (matchUpdate === null) {
            console.warn("Invalid match update, skipping");
        } else if (matchUpdate.needsRefresh) {
            const newMatchInfo: MatchInfo | null = await this.queryMatchInfo();
            if (newMatchInfo === null) {
                console.warn("Invalid match info, skipping");
            } else {
                this._matchInfo = newMatchInfo;
                // console.log(JSON.stringify(this._matchInfo, null, 4));
            }
        } else if (matchUpdate.matchTime != null) {
            this._matchInfo.matchTime = matchUpdate.matchTime;
            // console.log("Match Time:", this._matchInfo.matchTime);
        }
    }

    public get matchInfo() {
        return this._matchInfo;
    }

    public get matchId() {
        return this._matchId;
    }

    private async queryMatchUpdate(): Promise<MatchUpdate | null> {
        try {
            const rawData: NewExchangeResponse = await checkNeedsRefresh(this._matchId, this._matchInfo.lastExchangeId);
            return parseNewExchangeResponse(rawData);
        } catch {
            return null;
        };
    }

    private async queryMatchInfo(): Promise<MatchInfo | null> {
        try {
            const rawData: GetStreamOverlayInfoResponse | null = await queryScorecardOverlayInfo(this._matchId, this._matchInfo.lastExchangeId);
            if (rawData === null) {
                throw new Error("Could not parse getStreamOverlayInfo response");
            }
            const matchInfo = parseOverlayInfo(rawData);
            return matchInfo;
        } catch {
            return null;
        }
    }
}