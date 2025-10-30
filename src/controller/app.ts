import { getOverlaySettings, setOverlaySettings, setCurrentMatchId } from "../utils/database";
import { onChange, onClick, query } from "../utils/dom";
import type { Settings } from "../utils/settings";

const CLASS_SUCCESS = "success";
const CLASS_ERROR = "error";

const setup = (): void => {
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
            matchIdEntry.textContent = '';
        }

        // Clear error message
        const matchIdEntryResult = query(".enter-match-id-result");
        if (matchIdEntryResult) {
            matchIdEntryResult.classList.remove(CLASS_SUCCESS, CLASS_ERROR);
            matchIdEntryResult.textContent = '';
        }
    });

    onChange(selectorKey("use-transparent-overlay"), () => {
        changeSettings(settings => {
            const newValue = queryKey<HTMLInputElement>("use-transparent-overlay")?.checked ?? false;
            settings.useTransparentOverlay = newValue;
        });
    });

    onChange(selectorKey("use-local-cors-routing"), () => {
        changeSettings(settings => {
            const newValue = queryKey<HTMLInputElement>("use-local-cors-routing")?.checked ?? false;
            settings.useLocalCorsRouting = newValue;
        });
    });

    onChange(selectorKey("switch-fighter-sides"), () => {
        changeSettings(settings => {
            const newValue = queryKey<HTMLInputElement>("switch-fighter-sides")?.checked ?? false;
            settings.switchFighterSides = newValue;
        });
    });

    console.log("Controller initialized");
}

/* General Helpers */

const queryKey = <T extends Element>(key: string): T | null => {
    return query<T>(selectorKey(key));
}

const selectorKey = (key: string): string => {
    return `[data-key="${key}"]`
}

const changeSettings = (callback: (settings: Settings) => void): void => {
    const settings = getOverlaySettings();
    callback(settings);
    setOverlaySettings(settings);
}

/* Match ID Input */

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

setup();
