import { createDefaultSettings, SettingsSchema, type Settings } from "./settings";

const KEY_CURRENT_MATCH_ID = "currentMatchId";
const KEY_SETTINGS = "overlaySettings";

export const getCurrentMatchId = (): string | null => {
    return localStorage.getItem(KEY_CURRENT_MATCH_ID);
}

export const getOverlaySettings = (): Settings => {
    const rawValue = localStorage.getItem(KEY_SETTINGS);
    if (rawValue) {
        try {
            return SettingsSchema.parse(JSON.parse(rawValue));
        } catch(err) {
            console.warn("Failed to retrieve settings", err);
        }
    }
    return createDefaultSettings();
}

export const setCurrentMatchId = (matchId: string | null) => {
    if (matchId) {
        localStorage.setItem(KEY_CURRENT_MATCH_ID, matchId);
    } else {
        localStorage.removeItem(KEY_CURRENT_MATCH_ID);
    }
}

export const setOverlaySettings = (settings: Settings): void => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}
