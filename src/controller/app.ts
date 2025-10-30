import { getOverlaySettings, setOverlaySettings, setCurrentMatchId } from "../utils/database";
import { onChange, onClick } from "../utils/dom";
import type { Settings } from "../utils/settings";

const setup = (): void => {
    onClick(".button.set-match-id", () => {
        console.log("Setting match ID");
        setCurrentMatchId("349668");
    });
    onClick(".button.clear-match-id", () => {
        console.log("Clearing match ID");
        setCurrentMatchId(null);
    });

    onChange(".use-transparent-overlay", () => {
        changeSettings(settings => {
            const newValue = (document.querySelector(".use-transparent-overlay") as HTMLInputElement)?.checked
            settings.useTransparentOverlay = newValue;
            console.log(`Setting transparent overlay to ${newValue}`);
        });
    });

    console.log("Controller initialized");
}

const changeSettings = (callback: (settings: Settings) => void): void => {
    const settings = getOverlaySettings();
    callback(settings);
    setOverlaySettings(settings);
}

setup();
