const KEY_CURRENT_MATCH_ID = "currentMatchId";

export const getCurrentMatchId = (): string | null => {
    return localStorage.getItem(KEY_CURRENT_MATCH_ID);
}

export const setCurrentMatchId = (matchId: string | null) => {
    if (matchId) {
        localStorage.setItem(KEY_CURRENT_MATCH_ID, matchId);
    } else {
        localStorage.removeItem(KEY_CURRENT_MATCH_ID);
    }
}
