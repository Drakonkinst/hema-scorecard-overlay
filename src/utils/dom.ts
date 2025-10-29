import { ca } from "zod/v4/locales";

export const setText = (selector: string, value: string): void => {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    } else {
        console.warn(`Could not find selector ${selector} for setText`);
    }
};

export const setBackgroundColor = (selector: string, value: string): void => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        element.style.backgroundColor = value;
    } else {
        console.warn(`Could not find selector ${selector} for setBackgroundColor`);
    }
};

export const setTextColor = (selector: string, value: string): void => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        element.style.color = value;
    } else {
        console.warn(`Could not find selector ${selector} for setTextColor`);
    }
};

export const onClick = (selector: string, callback: Function): void => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        element.addEventListener("click", () => {
            return callback();
        });
    } else {
        console.warn(`Could not find selector ${selector} for onClick`);
    }
};
