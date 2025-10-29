export default class AudioManager {
    #masterVolume = 0;
    library = {};

    setMasterVolume(value) {
        this.#masterVolume = value;
        this.library.forEach(audioData => audioData.audio.volume = audioData.volume * value);
    }

    setStartTime(key, value) {
        this.library[key].startTime = value;
    }

    setVolume(key, value) {
        this.library[key].volume = value * this.#masterVolume;
    }

    resetPlay(key) {
        this.library[key].audio.pause();
        this.library[key].audio.currentTime = this.library[key].startTime;
        this.library[key].audio.play();
    }

    add(key, audio) {
        this.library[key] = { audio: audio, volume: 1, startTime: 0 }
    }
}