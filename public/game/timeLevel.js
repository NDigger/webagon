import Level from "./level";
import { getConfig } from "../storage";

const timerElement = document.getElementById('timer');
export default class TimeLevel extends Level {
    #config = getConfig();
    #updateId = undefined;

    constructor(app, levelData, props) {
        super(app, levelData, props);
        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    #update() {
        const timerContent = String(Math.floor(this.getTime()*1000)/1000);
        timerElement.textContent = this.#config.funModeEnabled ? timerContent.split("").reverse().join("") : timerContent;
        requestAnimationFrame(() => this.#update());
    }

    destroy() {
        super.destroy();
        cancelAnimationFrame(this.#updateId);
    }
}