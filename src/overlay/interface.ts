import { getOverlaySettings } from "../utils/database";
import { setText, setBackgroundColor, setTextColor, getClassList } from "../utils/dom";
import type { MatchInfo } from "../utils/matchStateTypes";
import type { MatchState } from "./matchState";

const SECONDS_PER_MINUTE = 60;
const VAR_DEFAULT_BACKGROUND_COLOR = 'var(--overlay-secondary-background-color)';
const VAR_DEFAULT_TEXT_COLOR = 'var(--overlay-secondary-text-color)';
const TRANSPARENT = 'transparent';

export const updateInterface = (matchState: MatchState) => {
    const matchInfo: MatchInfo = matchState.matchInfo;
    if (!matchInfo) {
        return;
    }

    const settings = getOverlaySettings();
    const useTransparentOverlay = settings.useTransparentOverlay ?? false;
    const switchFighterSides = settings.switchFighterSides ?? false;
    const showDebugInfo = settings.showDebugInfo ?? false;

    // Switch sides on display only. Only use these variables to refer to fighters
    const fighter1 = switchFighterSides ? matchInfo.fighter2 : matchInfo.fighter1;
    const fighter2 = switchFighterSides ? matchInfo.fighter1 : matchInfo.fighter2;

    let fighter1BackgroundColor = fighter1.backgroundColor || VAR_DEFAULT_BACKGROUND_COLOR;
    let fighter2BackgroundColor = fighter2.backgroundColor || VAR_DEFAULT_BACKGROUND_COLOR;
    let fighter1TextColor = fighter1.textColor || VAR_DEFAULT_TEXT_COLOR;
    let fighter2TextColor = fighter2.textColor || VAR_DEFAULT_TEXT_COLOR;

    if (useTransparentOverlay) {
        fighter1BackgroundColor = TRANSPARENT;
        fighter2BackgroundColor = TRANSPARENT;
        fighter1TextColor = VAR_DEFAULT_TEXT_COLOR;
        fighter2TextColor = VAR_DEFAULT_TEXT_COLOR;
        getClassList("body")?.add("transparent");
    } else {
        getClassList("body")?.remove("transparent");
    }

    if (showDebugInfo) {
        getClassList(".overlay-debug-info")?.remove("hidden");

        // Update debug info
        setText(".debug-match-id-status", matchState.matchId || "Not Set");
        setText(".debug-error-status", matchState.errorMessage ? `Error: ${matchState.errorMessage}` : '');
        if (matchState.isApiConnected) {
            setText(".debug-scorecard-api-status", "Connected");
            getClassList(".debug-scorecard-api-status")?.remove("error");
        } else {
            setText(".debug-scorecard-api-status", matchState.errorMessage ? "Waiting" : "Not Connected");
            getClassList(".debug-scorecard-api-status")?.add("error");
        }
    } else {
        getClassList(".overlay-debug-info")?.add("hidden");
    }

    setText(".fighter-1-info .fighter-name", fighter1.name);
    setText(".fighter-2-info .fighter-name", fighter2.name);
    setText(".fighter-1-info .fighter-school", fighter1.school || '');
    setText(".fighter-2-info .fighter-school", fighter2.school || '');
    setBackgroundColor(".fighter-1-info", fighter1BackgroundColor);
    setBackgroundColor(".fighter-2-info", fighter2BackgroundColor);
    setTextColor(".fighter-1-info", fighter1TextColor);
    setTextColor(".fighter-2-info", fighter2TextColor);

    setText(".fighter-1-score", fighter1.score.toString());
    setText(".fighter-2-score", fighter2.score.toString());
    setText(".doubles", `Doubles: ${doublesToStr(matchInfo.doubles, !settings.funMode)}`);
    setText(".match-time", timeToStr(matchInfo.matchTime));
}

const timeToStr = (time: number) => {
    const minutes = Math.floor(time / SECONDS_PER_MINUTE);
    const seconds = Math.floor(time % SECONDS_PER_MINUTE);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const doublesToStr = (doubles: number, numberOnly: boolean) => {
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

