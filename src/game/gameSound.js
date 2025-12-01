import { getConfig } from "../storage"

export default class GameSound {
    #audio;
    volume = 1;
    startTime = 0;

    constructor(src) {
        this.#audio = new Audio(src);
    }

    play(time) {
        this.#audio.volume = getConfig().soundsVolume * this.volume;
        this.#audio.currentTime = this.startTime;
        this.#audio.play()
    }

    stop() {
        this.#audio.pause();
    }
}