import type { MatchInfo } from "../utils/matchStateTypes";

export const initInterface = () => {

}

export const updateInterface = (matchInfo: MatchInfo) => {
    if (!matchInfo) {
        return;
    }

    setText(".fighter-1-info .fighter-name", matchInfo.fighter1.name);
    setText(".fighter-2-info .fighter-name", matchInfo.fighter2.name);
    if (matchInfo.fighter1.school) {
        setText(".fighter-1-info .fighter-school", matchInfo.fighter1.school);
    }
    if (matchInfo.fighter2.school) {
        setText(".fighter-2-info .fighter-school", matchInfo.fighter2.school);
    }
    if (matchInfo.fighter1.backgroundColor) {
        setBackgroundColor(".fighter-1-info", matchInfo.fighter1.backgroundColor);
    }
    if (matchInfo.fighter2.backgroundColor) {
        setBackgroundColor(".fighter-2-info", matchInfo.fighter2.backgroundColor);
    }
    if (matchInfo.fighter1.textColor) {
        setTextColor(".fighter-1-info", matchInfo.fighter1.textColor);
    }
    if (matchInfo.fighter2.textColor) {
        setTextColor(".fighter-2-info", matchInfo.fighter2.textColor);
    }

    setText(".fighter-1-score", matchInfo.fighter1.score.toString());
    setText(".fighter-2-score", matchInfo.fighter2.score.toString());
    setText(".doubles", `Doubles: ${matchInfo.doubles}`);
    setText(".match-time", matchInfo.matchTime);
}

const setText = (selector: string, value: string): void => {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

const setBackgroundColor = (selector: string, value: string): void => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        element.style.backgroundColor = value;
    }
}

const setTextColor = (selector: string, value: string): void => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        element.style.color = value;
    }
}