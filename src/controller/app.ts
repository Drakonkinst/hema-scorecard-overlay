import { setCurrentMatchId } from "../utils/database";
import { onClick } from "../utils/dom";

const setup = (): void => {
    onClick(".button.set-match-id", () => {
        console.log("Setting match ID");
        setCurrentMatchId("349668");
    });
    onClick(".button.clear-match-id", () => {
        console.log("Clearing match ID");
        setCurrentMatchId(null);
    });
    console.log("Controller initialized");
}

setup();
