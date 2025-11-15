
import * as PIXI from 'pixi.js'
import LevelLoader from './game/levelLoader';
import AudioManager from './utils/audioManager';
import './frameCounter';
import GameSound from './game/gameSound';

const selectedLevelInfo = document.getElementById('selected-level')

const createApp = async () => {
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
        resolution: devicePixelRatio,
        antialias: true
    });

    window.addEventListener('resize', () => {
        app.renderer.resolution = devicePixelRatio;
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    app.canvas.id = 'game'
    document.querySelector('body').appendChild(app.canvas);
    return app;
}

export const soundManager = new AudioManager();
soundManager.add('level-select', new Audio('audio/levelSelect.mp3'))
soundManager.setStartTime('level-select', .12)
soundManager.add('level-load', new Audio('audio/levelLoad.ogg'))
soundManager.setStartTime('level-load', .12)

export function setBestScore(score) {
    let zeros = ''
    if (parseFloat(score) < 10) zeros = 'OO';
    else if (parseFloat(score) < 100) zeros = 'O';
    selectedLevelInfo.querySelector('.best').innerHTML = `<span style="opacity:.5">${zeros}</span>${score.toFixed(3).toString().replaceAll('0', 'O')}`
}

let level
export { level }
export function setLevel(v) { level = v }

let app;
export { app }

const loadScript = src => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'module';
    document.querySelector('body').appendChild(script);
}

let levelLoader
export { levelLoader }
(async () => {
    const a = await createApp()
    app = a;
    levelLoader = new LevelLoader(a);
    loadScript('./levelSelect.js')
})()

