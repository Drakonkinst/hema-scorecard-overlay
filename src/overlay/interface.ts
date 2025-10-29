import { setText, setBackgroundColor, setTextColor } from "../utils/dom";
import type { MatchInfo } from "../utils/matchStateTypes";

const VAR_PRIMARY_BACKGROUND_COLOR = 'var(--primary-background-color)';
const VAR_PRIMARY_TEXT_COLOR = 'var(--primary-text-color)';

export const updateInterface = (matchInfo: MatchInfo) => {
    if (!matchInfo) {
        return;
    }

    setText(".fighter-1-info .fighter-name", matchInfo.fighter1.name);
    setText(".fighter-2-info .fighter-name", matchInfo.fighter2.name);
    setText(".fighter-1-info .fighter-school", matchInfo.fighter1.school || '');
    setText(".fighter-2-info .fighter-school", matchInfo.fighter2.school || '');
    setBackgroundColor(".fighter-1-info", matchInfo.fighter1.backgroundColor || VAR_PRIMARY_BACKGROUND_COLOR);
    setBackgroundColor(".fighter-2-info", matchInfo.fighter2.backgroundColor || VAR_PRIMARY_BACKGROUND_COLOR);
    setTextColor(".fighter-1-info", matchInfo.fighter1.textColor || VAR_PRIMARY_TEXT_COLOR);
    setTextColor(".fighter-2-info", matchInfo.fighter2.textColor || VAR_PRIMARY_TEXT_COLOR);

    setText(".fighter-1-score", matchInfo.fighter1.score.toString());
    setText(".fighter-2-score", matchInfo.fighter2.score.toString());
    setText(".doubles", `Doubles: ${matchInfo.doubles}`);
    setText(".match-time", matchInfo.matchTime);
}

