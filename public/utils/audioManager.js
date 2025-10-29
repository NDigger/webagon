
class AudioData {
    audio
    volume = 1
    startTime = 0
}
export default class AudioManager {
    #masterVolume = 0;
    library = [];

    setMasterVolume(value) {
        this.#masterVolume = value;
        this.library.forEach(audioData => audioData.audio.volume = audioData.volume * value);
    }

    setVolume(audioData, value) {
        audioData.volume = value * this.#masterVolume;
    }

    resetPlay(audioData) {
        audioData.audio.pause();
        audioData.audio.currentTime = audioData.startTime;
        audioData.audio.play();
    }

    add(audio) {
        const audioData = new AudioData();
        audioData.audio = audio;
        this.library.push(audioData);
        return audioData;
    }
}