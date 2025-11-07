import { parseNewExchangeResponse, parseOverlayInfo } from "./dataParsing";
import { getBlankMatchInfo, type MatchUpdate } from "../utils/matchStateTypes";
import { type MatchInfo } from "../utils/matchStateTypes";
import { ApiStatus, checkNeedsRefresh, queryScorecardOverlayInfo, type ApiResponse } from "./scorecardApi";
import type { GetStreamOverlayInfoResponse, NewExchangeResponse } from "./apiTypes";
import { setCurrentMatchInfo } from "../utils/database";

export class MatchState {
    private readonly _matchId: string;
    private _matchInfo: MatchInfo;
    private _errorStatus: string | null;
    private _apiConnected: boolean;

    constructor(matchId?: string) {
        this._matchId = matchId ?? '';
        this._matchInfo = getBlankMatchInfo();
        this._errorStatus = null;
        this._apiConnected = false;
    }

    public async updateMatch(): Promise<void> {
        // Do no queries if it the match ID is blank
        if (!this._matchId) {
            this._errorStatus = "You must provide a match link!";
            return;
        }

        const matchUpdate: MatchUpdate | null = await this.queryMatchUpdate();

        if (matchUpdate === null) {
            return;
        }

        if (matchUpdate.needsRefresh) {
            const newMatchInfo: MatchInfo | null = await this.queryMatchInfo();
            if (newMatchInfo === null) {
                return;
            }
            this._matchInfo = newMatchInfo;
            setCurrentMatchInfo(this._matchInfo);
            this.clearErrors();
            // console.log(JSON.stringify(this._matchInfo, null, 4));
        } else if (matchUpdate.matchTime !== null) {
            this._matchInfo.matchTime = matchUpdate.matchTime;
            setCurrentMatchInfo(this._matchInfo);
            this.clearErrors();
            // console.log("Match Time:", this._matchInfo.matchTime);
        }
    }

    private clearErrors() {
        this._apiConnected = true;
        this._errorStatus = null;
    }

    public get matchInfo() {
        return this._matchInfo;
    }

    public get matchId() {
        return this._matchId;
    }

    public get errorMessage() {
        return this._errorStatus;
    }

    public get isApiConnected() {
        return this._apiConnected;
    }

    private async queryMatchUpdate(): Promise<MatchUpdate | null> {
        const response: ApiResponse<NewExchangeResponse> = await checkNeedsRefresh(this._matchId, this._matchInfo.lastExchangeId);
        if ("data" in response) {
            return parseNewExchangeResponse(response.data);
        } else {
            this.handleErrorStatus("queryMatchUpdate", response.error, response.message);
            return null;
        }
    }

    private async queryMatchInfo(): Promise<MatchInfo | null> {
        const response: ApiResponse<GetStreamOverlayInfoResponse> = await queryScorecardOverlayInfo(this._matchId, this._matchInfo.lastExchangeId);
        if ("data" in response) {
            const matchInfo = parseOverlayInfo(response.data);
            return matchInfo;
        } else {
            this.handleErrorStatus("queryMatchInfo", response.error, response.message);
            return null;
        }
    }

    private handleErrorStatus(functionName: string, error: ApiStatus, message?: string, ): void {
        if (error === ApiStatus.NETWORK_ERROR) {
            this._apiConnected = false;
        } else if (error === ApiStatus.PARSING_ERROR) {
            // Match info is not returning correct data
            this._errorStatus = "Invalid match ID!"
        } else {
            console.error(`${functionName} status not handled: ${error} - ${message ?? '{}'}`);
            return;
        }
        // console.warn(`${functionName} failed with status: ${error}`);
        console.warn(`${functionName} failed with status: ${error} - ${message}`);
    }
}