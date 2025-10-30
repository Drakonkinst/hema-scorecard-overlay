import { getOverlaySettings } from "../utils/database";
import { setText, setBackgroundColor, setTextColor, getClassList } from "../utils/dom";
import type { MatchInfo } from "../utils/matchStateTypes";

const VAR_DEFAULT_BACKGROUND_COLOR = 'var(--overlay-secondary-background-color)';
const VAR_DEFAULT_TEXT_COLOR = 'var(--overlay-secondary-text-color)';
const TRANSPARENT = 'transparent';

export const updateInterface = (matchInfo: MatchInfo) => {
    if (!matchInfo) {
        return;
    }

    const useTransparentOverlay = getOverlaySettings().useTransparentOverlay ?? false;
    let fighter1BackgroundColor = matchInfo.fighter1.backgroundColor || VAR_DEFAULT_BACKGROUND_COLOR;
    let fighter2BackgroundColor = matchInfo.fighter2.backgroundColor || VAR_DEFAULT_BACKGROUND_COLOR;
    let fighter1TextColor = matchInfo.fighter1.textColor || VAR_DEFAULT_TEXT_COLOR;
    let fighter2TextColor = matchInfo.fighter2.textColor || VAR_DEFAULT_TEXT_COLOR;

    if (useTransparentOverlay) {
        fighter1BackgroundColor = TRANSPARENT;
        fighter2BackgroundColor = TRANSPARENT;
        fighter1TextColor = VAR_DEFAULT_TEXT_COLOR;
        fighter2TextColor = VAR_DEFAULT_TEXT_COLOR;
        getClassList("body")?.add("transparent");
    } else {
        getClassList("body")?.remove("transparent");
    }

    setText(".fighter-1-info .fighter-name", matchInfo.fighter1.name);
    setText(".fighter-2-info .fighter-name", matchInfo.fighter2.name);
    setText(".fighter-1-info .fighter-school", matchInfo.fighter1.school || '');
    setText(".fighter-2-info .fighter-school", matchInfo.fighter2.school || '');
    setBackgroundColor(".fighter-1-info", fighter1BackgroundColor);
    setBackgroundColor(".fighter-2-info", fighter2BackgroundColor);
    setTextColor(".fighter-1-info", fighter1TextColor);
    setTextColor(".fighter-2-info", fighter2TextColor);

    setText(".fighter-1-score", matchInfo.fighter1.score.toString());
    setText(".fighter-2-score", matchInfo.fighter2.score.toString());
    setText(".doubles", `Doubles: ${matchInfo.doubles}`);
    setText(".match-time", matchInfo.matchTime);
}

