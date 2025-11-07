import { getOverlaySettings, setOverlaySettings, setCurrentMatchId, getCurrentMatchId, setMatchOverrides, getMatchOverrides, getCurrentMatchInfo } from "../utils/database";
import { onChange, onClick, query, queryAll } from "../utils/dom";
import type { FighterInfo, MatchInfo, PartialMatchInfo } from "../utils/matchStateTypes";
import type { Settings } from "../utils/settings";

const CLASS_SUCCESS = "success";
const CLASS_ERROR = "error";

const setup = (): void => {
    setupMatchIdInput();

    addCheckbox("use-transparent-overlay", "useTransparentOverlay");
    addCheckbox("use-local-cors-routing", "useLocalCorsRouting");
    addCheckbox("switch-fighter-sides", "switchFighterSides");
    addCheckbox("show-debug-info", "showDebugInfo");
    addCheckbox("fun-mode", "funMode", true);

    setupMatchOverrideInput();

    console.log("Controller initialized");
};

/* General Helpers */

const queryKey = <T extends Element = HTMLElement>(key: string): T | null => {
    return query<T>(selectorKey(key));
};

const selectorKey = (key: string): string => {
    return `[data-key="${key}"]`
};

const changeSettings = (callback: (settings: Settings) => void): void => {
    const settings = getOverlaySettings();
    callback(settings);
    setOverlaySettings(settings);
};

/* Checkbox */

const addCheckbox = (key: string, property: keyof Settings, defaultValue = false): void => {
    onChange(selectorKey(key), () => {
        changeSettings(settings => {
            const newValue = queryKey<HTMLInputElement>(key)?.checked ?? defaultValue;
            settings[property] = newValue;
        });
    });

    // Set the initial value
    const element = queryKey<HTMLInputElement>(key)
    if (element) {
        element.checked = getOverlaySettings()[property] ?? defaultValue;
    }
};

/* Match ID Input */

const setupMatchIdInput = (): void => {
    const inputElement = queryKey<HTMLInputElement>("match-id");
    if (inputElement) {
        const matchId = getCurrentMatchId();
        if (matchId) {
            inputElement.value = matchId;
        }
        inputElement.addEventListener("keypress", event => {
            if (event.key === "Enter") {
                queryKey("set-match-id")?.click();
            }
        });
    }

    onClick(selectorKey("set-match-id"), () => {
        console.log("Setting match ID");
        const matchId = getMatchIdFromInput();
        if (matchId) {
            setCurrentMatchId(matchId);
        }
    });

    onClick(selectorKey("clear-match-id"), () => {
        console.log("Clearing match ID");
        setCurrentMatchId(null);

        // Clear entry field
        const matchIdEntry = queryKey<HTMLInputElement>("match-id");
        if (matchIdEntry) {
            matchIdEntry.value = '';
            matchIdEntry.focus();
        }

        // Clear error message
        const matchIdEntryResult = query(".enter-match-id-result");
        if (matchIdEntryResult) {
            matchIdEntryResult.classList.remove(CLASS_SUCCESS, CLASS_ERROR);
            matchIdEntryResult.textContent = '';
        }
    });
};

const getMatchIdFromInput = (): string | null => {
    // Make sure the entry field exists
    const matchIdEntry = queryKey<HTMLInputElement>("match-id");
    if (!matchIdEntry) {
        setMatchIdResult("Could not retrieve value, please contact developer.", false);
        return null;
    }

    // Check input is not empty
    let matchInputUrl = matchIdEntry.value;

    // Clean up fragment character
    if (matchInputUrl.endsWith('#')) {
        matchInputUrl = matchInputUrl.substring(0, matchInputUrl.length - 1);
    }

    if (!matchInputUrl.length) {
        setMatchIdResult("URL cannot be blank.", false);
        return null;
    }

    // Special case: Check if they just entered the match ID directly
    if (isNumeric(matchInputUrl)) {
        try {
            const matchIdValue = parseInt(matchInputUrl);
            if (matchIdValue > 0) {
                setMatchIdResult(`Successfully set match ID to: ${matchInputUrl}`, true);
                return matchInputUrl;
            } else {
                setMatchIdResult("Match ID must be a positive number.", false);
                return null;
            }
        } catch {
            setMatchIdResult("Match ID is not a valid number.", false);
            return null;
        }
    }

    const urlParameter = extractMatchIdFromUrl(matchInputUrl);
    if (!urlParameter) {
        setMatchIdResult("Invalid URL, match URL must contain a match ID (m=...)", false);
        return null;
    }
    if (!isNumeric(urlParameter)) {
        setMatchIdResult("Match ID must be a positive number.", false);
        return null;
    }
    try {
        const matchIdValue = parseInt(urlParameter);
        if (matchIdValue > 0) {
            setMatchIdResult(`Successfully set match ID to: ${urlParameter}`, true);
            return urlParameter;
        } else {
            setMatchIdResult("Match ID must be a positive number.", false);
            return null;
        }
    } catch {
        setMatchIdResult("Match ID is not a valid number.", false);
        return null;
    }
}

const extractMatchIdFromUrl = (url: string): string | null => {
    const urlParams = new URLSearchParams(url);
    return urlParams.get('m');
}

const setMatchIdResult = (message: string, isSuccess: boolean) => {
    const matchIdEntryResult = query(".enter-match-id-result");
    if (matchIdEntryResult) {
        matchIdEntryResult.classList.add(isSuccess ? CLASS_SUCCESS : CLASS_ERROR);
        matchIdEntryResult.classList.remove(isSuccess ? CLASS_ERROR : CLASS_SUCCESS);
        matchIdEntryResult.textContent = (isSuccess ? '' : 'Error: ') + message;
    }
}

// https://stackoverflow.com/a/24457420
const isNumeric = (value: string): boolean => {
    return /^\d+$/.test(value);
}

/* Match Override Input */

// Annoyingly, the color picker defaults to #000000
// Make it default to this color instead to make selecting common colors easier
const DEFAULT_COLOR = "#010101";

// There were better ways to organize this
// Ah well
const OVERRIDE_COLOR_FIELDS = ["fighter-1-text-color", "fighter-2-text-color", "fighter-1-background-color", "fighter-2-background-color"];
const OVERRIDE_NUMBER_FIELDS = ["fighter-1-score", "fighter-2-score", "doubles", "match-time"];
const OVERRIDE_FIELD_MAP: Record<string, keyof MatchInfo | ['fighter1' | 'fighter2', keyof FighterInfo]> = {
    "tournament-name": "tournamentName",
    "fighter-1-name": ["fighter1", "name"],
    "fighter-1-school": ["fighter1", "school"],
    "fighter-1-text-color": ["fighter1", "textColor"],
    "fighter-1-background-color": ["fighter1", "backgroundColor"],
    "fighter-2-name": ["fighter2", "name"],
    "fighter-2-school": ["fighter2", "school"],
    "fighter-2-text-color": ["fighter2", "textColor"],
    "fighter-2-background-color": ["fighter2", "backgroundColor"],
    "fighter-1-score": ["fighter1", "score"],
    "fighter-2-score": ["fighter2", "score"],
    "doubles": "doubles",
    "match-time": "matchTime",
};
const SECOND_TO_MS = 1000;

let suppressAutoUpdates: boolean = false;
const setupMatchOverrideInput = (): void => {
    setupCollapsibles();
    setupNumberInputs();
    addCheckbox("increase-match-time", "increaseMatchTime", false);
    addCheckbox("auto-update-overrides", "autoUpdateOverrides", true);
    initOverrideFieldsFromData();

    const containerElement = query(".match-overrides");
    if (containerElement) {
        containerElement.addEventListener("keypress", event => {
            if (event.key === "Enter") {
                autoUpdateOverrides();
            }
        });
    }

    onClick(selectorKey("update-overrides"), updateOverrides);
    onClick(selectorKey("clear-overrides"), clearOverrides);
    onClick(selectorKey("use-default-overrides"), setDefaultOverrides);

    for (const key of OVERRIDE_NUMBER_FIELDS) {
        addOverrideChangeListener(key);
    }
    for (const key of OVERRIDE_COLOR_FIELDS) {
        addOverrideChangeListener(key);
    }

    initMatchTimer();
};

const initMatchTimer = () => {
    const element = queryKey<HTMLInputElement>("match-time");
    if (!element) {
        console.warn("Could not start match timer, no key found");
        return;
    }
    setInterval(() => {
        const settings = getOverlaySettings();
        if (settings.increaseMatchTime) {
            const currentValue = parseInt(element.value);
            const currentTime = isNaN(currentValue) ? 0 : currentValue;
            element.value = (currentTime + 1).toString();
            autoUpdateOverrides();
        }
    }, SECOND_TO_MS);
};

const initOverrideFieldsFromData = (): void => {
    const overrides = getMatchOverrides();
    suppressAutoUpdates = true;
    for (const [key, value] of Object.entries(OVERRIDE_FIELD_MAP)) {
        const element = queryKey<HTMLInputElement>(key);
        if (!element) {
            continue;
        }
        if (Array.isArray(value)) {
            const matchAttribute = value[0];
            const fighterAttribute = value[1];
            if (overrides[matchAttribute]) {
                if (overrides[matchAttribute][fighterAttribute]) {
                    element.value = overrides[matchAttribute][fighterAttribute].toString();
                    continue;
                }
            }
        } else {
            if (overrides[value]) {
                element.value = overrides[value].toString();
                continue;
            }
        }
        clearInputField(key, element);
    }
    suppressAutoUpdates = false;
}

const addOverrideChangeListener = (key: string) => {
    const element = queryKey<HTMLInputElement>(key);
    if (element) {
        element.addEventListener("change", () => {
            autoUpdateOverrides();
        });
    }
}

const updateOverrides = (): void => {
    console.log("Updating overrides!");

    const overrides: PartialMatchInfo = {};
    for (const [key, value] of Object.entries(OVERRIDE_FIELD_MAP)) {
        const element = queryKey<HTMLInputElement>(key);
        if (element && element.value && (!OVERRIDE_COLOR_FIELDS.includes(key) || element.value !== DEFAULT_COLOR)) {
            // console.debug(`Found ${key} = ${element.value}`);
            if (Array.isArray(value)) {
                // Fighter info
                const matchAttribute = value[0];
                const fighterAttribute = value[1];
                if (!overrides[matchAttribute]) {
                    overrides[matchAttribute] = {};
                }
                // Catch numeric fields
                if (fighterAttribute === "score") {
                    overrides[matchAttribute][fighterAttribute] = parseInt(element.value);
                } else {
                    overrides[matchAttribute][fighterAttribute] = element.value;
                }
            } else {
                // Catch numeric fields
                if (value === "doubles" || value === "matchTime") {
                    overrides[value] = parseInt(element.value);
                } else {
                    overrides[value] = element.value;
                }
            }
        }
    }

    setMatchOverrides(overrides);
};

// Pull defaults from the actual match info
const setDefaultOverrides = (): void => {
    const matchInfo = getCurrentMatchInfo();
    setMatchOverrides(matchInfo);
    initOverrideFieldsFromData();
    updateOverrides();
}

const clearInputField = (key: string, element: HTMLInputElement): void => {
    if (OVERRIDE_COLOR_FIELDS.includes(key)) {
        element.value = DEFAULT_COLOR;
    } else {
        element.value = '';
    }
}

const clearOverrides = (): void => {
    // Stop a bunch of auto updates from firing
    suppressAutoUpdates = true;

    for (const key of Object.keys(OVERRIDE_FIELD_MAP)) {
        const element = queryKey<HTMLInputElement>(key);
        if (element) {
            clearInputField(key, element);
        }
    }
    const increaseMatchTime = queryKey<HTMLInputElement>("increase-match-time");
    if (increaseMatchTime) {
        increaseMatchTime.checked = false;
        changeSettings(settings => {
            settings.increaseMatchTime = false;
        });
    }
    suppressAutoUpdates = false;
    autoUpdateOverrides();
}

const autoUpdateOverrides = (): void => {
    const shouldAutoUpdateOverrides = (getOverlaySettings().autoUpdateOverrides ?? true) && !suppressAutoUpdates;
    if (shouldAutoUpdateOverrides) {
        updateOverrides();
    }
};

const setupNumberInputs = (): void => {
    const elements = queryAll(".number-input");
    if (!elements) {
        return;
    }
    elements.forEach(element => {
        const numberInput = element.querySelector<HTMLInputElement>("input[type=number]");
        if (!numberInput) {
            console.warn("Could not find number input");
            return;
        }
        const plus = element.querySelector<HTMLElement>(".plus");
        if (plus) {
            plus.addEventListener("click", () => {
                numberInput.stepUp();
                // We can assume they're all overrides right now
                autoUpdateOverrides();
            });
        }
        const minus = element.querySelector<HTMLElement>(".minus");
        if (minus) {
            minus.addEventListener("click", () => {
                numberInput.stepDown();
                // We can assume they're all overrides right now
                autoUpdateOverrides();
            });
        }
    });
};

const setupCollapsibles = (): void => {
    const elements = queryAll(".config-section.collapsible");
    if (!elements) {
        return;
    }
    elements.forEach(element => {
        const header = element.querySelector<HTMLElement>(".collapsible-header");
        const contents = element.querySelector<HTMLElement>(".collapsible-content-wrapper");
        if (!header || !contents) {
            console.warn("Could not find header and/or contents for collapsible element");
            return;
        }
        header.addEventListener("click", () => {
            const isActive = element.classList.toggle("active");
            if (isActive) {
                // This doesn't always work when the window is resized...ah well
                contents.style.maxHeight = contents.scrollHeight + "px";
            } else {
                contents.style.maxHeight = '0';
            }
        });
    });
};

setup();
