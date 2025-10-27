export default class AudioManager {
    play(path) {
        const audio = new Audio();
        audio.src = path;
        audio.play();
    }
}