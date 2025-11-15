import fitty from "fitty";
import { getOverlaySettings } from "../utils/database";
import { setText, getClassList, query } from "../utils/dom";
import type { MatchInfo } from "../utils/matchStateTypes";
import type { MatchState } from "./matchState";
import { applyMatchOverrides } from "./overrides";

const SECONDS_PER_MINUTE = 60;
const VAR_DEFAULT_BACKGROUND_COLOR = 'var(--overlay-fighter-default-background-color)';
const VAR_DEFAULT_TEXT_COLOR = 'var(--overlay-fighter-default-text-color)';
const VAR_TRANSPARENT_TEXT_COLOR = 'var(--overlay-fighter-transparent-text-color)';
const VAR_TRANSPARENT_BACKGROUND_COLOR = 'transparent';
const BASE_REM = 20;

export const initInterface = () => {
    // For some reason, this shrinks when the window does but doesn't re-expand.
    // Ah well, shouldn't matter for this use case.
    fitty(".fighter-1-info .fighter-name", {
        maxSize: 3 * BASE_REM,
    });
    fitty(".fighter-1-info .fighter-school", {
        maxSize: 1.25 * BASE_REM,
    });
    fitty(".fighter-2-info .fighter-name", {
        maxSize: 3 * BASE_REM,
    });
    fitty(".fighter-2-info .fighter-school", {
        maxSize: 1.25 * BASE_REM,
    });
};

export const updateInterface = (matchState: MatchState) => {
    const matchInfo: MatchInfo = applyMatchOverrides(matchState.matchInfo);

    const settings = getOverlaySettings();
    const useTransparentOverlay = settings.useTransparentOverlay ?? false;
    const switchFighterSides = settings.switchFighterSides ?? false;
    const showDebugInfo = settings.showDebugInfo ?? false;

    // Switch sides on display only. Only use these variables to refer to fighters
    const fighter1 = switchFighterSides ? matchInfo.fighter2 : matchInfo.fighter1;
    const fighter2 = switchFighterSides ? matchInfo.fighter1 : matchInfo.fighter2;

    let fighter1BackgroundColor = fighter1.backgroundColor || VAR_DEFAULT_BACKGROUND_COLOR;
    let fighter2BackgroundColor = fighter2.backgroundColor || VAR_DEFAULT_BACKGROUND_COLOR;
    const fighter1TextColor = fighter1.textColor || (useTransparentOverlay ? VAR_TRANSPARENT_TEXT_COLOR : VAR_DEFAULT_TEXT_COLOR);
    const fighter2TextColor = fighter2.textColor || (useTransparentOverlay ? VAR_TRANSPARENT_TEXT_COLOR : VAR_DEFAULT_TEXT_COLOR);

    if (useTransparentOverlay) {
        fighter1BackgroundColor = VAR_TRANSPARENT_BACKGROUND_COLOR;
        fighter2BackgroundColor = VAR_TRANSPARENT_BACKGROUND_COLOR;
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
    const bodyEl = query("body");
    if (bodyEl) {
        bodyEl.style.setProperty("--overlay-fighter-1-text-color", fighter1TextColor);
        bodyEl.style.setProperty("--overlay-fighter-2-text-color", fighter2TextColor);
        bodyEl.style.setProperty("--overlay-fighter-1-background-color", fighter1BackgroundColor);
        bodyEl.style.setProperty("--overlay-fighter-2-background-color", fighter2BackgroundColor);
    }

    setText(".fighter-1-score", isNaN(fighter1.score) ? '0' : fighter1.score.toString());
    setText(".fighter-2-score", isNaN(fighter2.score) ? '0' : fighter2.score.toString());
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

