import { getConfig } from "../storage"

export default class GameSound {
    #audio;
    volume = 1;

    constructor(src) {
        this.#audio = new Audio(src);
    }

    play(time) {
        this.#audio.volume = getConfig().soundsVolume * this.volume;
        this.#audio.currentTime = time ?? 0;
        this.#audio.play()
    }
}