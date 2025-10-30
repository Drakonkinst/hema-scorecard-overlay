import { getCurrentMatchId } from "../utils/database";
import { updateInterface } from "./interface";
import { MatchState } from "./matchState";

const UPDATE_INTERVAL = 1 * 1000; // Every second
const TEST_MATCH_ID = "349668";
const BLANK_MATCH_STATE = new MatchState();

let matchState: MatchState = BLANK_MATCH_STATE;

const updateMatchState = () => {
    // Reset current match state if needed
    let matchId: string | null = getCurrentMatchId();
    if (matchId != null && matchId != matchState.matchId) {
        matchState = new MatchState(matchId);
    } else if (matchId === null && matchState.matchId) {
        matchState = BLANK_MATCH_STATE;
    }
}

const doUpdate = async () => {
    updateMatchState();
    await matchState.updateMatch();
    updateInterface(matchState.matchInfo);
};

// Start loop
setInterval(doUpdate, UPDATE_INTERVAL);
doUpdate();