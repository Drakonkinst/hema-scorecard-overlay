import { initInterface, updateInterface } from "./interface";
import { MatchState } from "./matchState";

const UPDATE_INTERVAL = 1 * 1000; // Every second

// TODO: Grab this from user input instead
let matchId: string = "349668";
let matchState: MatchState = new MatchState(matchId);

const doUpdate = async () => {
    await matchState.updateMatch();
    updateInterface(matchState.matchInfo);
};

initInterface();

// Start loop
setInterval(doUpdate, UPDATE_INTERVAL);
doUpdate();