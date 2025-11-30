
import * as PIXI from 'pixi.js'
import LevelLoader from './game/levelLoader';
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

const sounds = {};
(function() {
    sounds.levelSelect = new GameSound('./audio/levelSelect.mp3');
    sounds.levelSelect.startTime = 0.12;

    sounds.levelLoad = new GameSound('./audio/levelLoad.ogg');
    sounds.levelLoad.startTime = 0.12;    

    sounds.swap = new GameSound('./../audio/playerSwap.ogg');

    sounds.death = new GameSound('./../audio/death.ogg');
    sounds.death.startTime = .3;

    sounds.increment = new GameSound('./../audio/increment.mp3');
})()
export { sounds };

const bestScoreElement = selectedLevelInfo.querySelector('.best');
export function setBestScore(score, completable = false) {
    // let zeros = ''
    // if (parseFloat(score) < 10) zeros = 'OO';
    // else if (parseFloat(score) < 100) zeros = 'O';
    // bestScoreElement.innerHTML = `<span style="opacity:.5">${zeros}</span>${score.toFixed(3).toString().replaceAll('0', 'O')}`
    if (completable) {
        const percent = `${score*100}%`;
        bestScoreElement.textContent = score === 1 ? 'done' : percent;
        bestScoreElement.style.setProperty('--percent', `${(1-score)*100}%`);
    }
    else {
        bestScoreElement.textContent = score === 0 ? 'none' : score;
        bestScoreElement.style.setProperty('--percent', '0%');
    }
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
    loadScript('./settings.js');
})()

const settingsElement = document.getElementById('settings');
const levelSelectElement = document.getElementById('level-select');

const headerButtons = document.querySelector('header .buttons');
const headerButtonsAll = Array.from(document.querySelectorAll('header .buttons > button'))
const menuElements = Array.from(document.getElementById('menu-window').children);
headerButtons.querySelector('.level-select').classList.add('selected');

headerButtonsAll.forEach(btn => btn.addEventListener('click', () => {
    menuElements.forEach(el => {
        el.style.display = 'none'
        el.setAttribute('data-events-enabled', 'false');
    })
    headerButtonsAll.forEach(b => b.classList.remove('selected'))

    const menuWindow = document.getElementById(btn.getAttribute('data-window'));
    menuWindow.style.display = 'flex';
    menuWindow.setAttribute('data-events-enabled', 'true');
    btn.classList.add('selected');

    sounds.levelSelect.play();
}))