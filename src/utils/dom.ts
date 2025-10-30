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

export const onClick = (selector: string, callback: (event: Event) => any): void => {
    return onEvent(selector, callback, "click");
};

export const onChange = (selector: string, callback: (event: Event) => any): void => {
    return onEvent(selector, callback, "change");
};

export const onEvent = (selector: string, callback: (event: Event) => any, event: string): void => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        element.addEventListener(event, (ev) => {
            return callback(ev);
        });
    } else {
        console.warn(`Could not find selector ${selector} for onEvent ${event}`);
    }
}

export const getClassList = (selector: string): DOMTokenList | null => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
        return element.classList;
    } else {
        console.warn(`Could not find selector ${selector} for getClassList`);
        return null;
    }
}
