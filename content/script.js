
import * as PIXI from 'pixi.js'
import LevelLoader from './game/levelLoader.js';
import './frameCounter.js';
import GameSound from './game/gameSound.js';

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

export const getPublicURL = () => import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL;

const sounds = {};
(function() {
    sounds.levelSelect = new GameSound(getPublicURL() + '/audio/levelSelect.mp3');
    sounds.levelSelect.startTime = 0.12;

    sounds.levelLoad = new GameSound(getPublicURL() + '/audio/levelLoad.ogg');
    sounds.levelLoad.startTime = 0.12;    

    sounds.swap = new GameSound(getPublicURL() + '/audio/playerSwap.ogg');

    sounds.death = new GameSound(getPublicURL() + '/audio/death.ogg');
    sounds.death.startTime = .04;
    sounds.death.volume = .3;

    sounds.increment = new GameSound(getPublicURL() + '/audio/increment.ogg');
    sounds.increment.volume = 0;
    sounds.increment.startTime = .07;
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
    await import('./levelSelect.js');
    await import('./settings.js');
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

const infoPopup = document.getElementById('info-popup');
if (localStorage.getItem('webagon-first-popup-seen') !== 'true') {
    infoPopup.style.display = 'block';
    const fn = () => {
        infoPopup.style.display = 'none';
        document.removeEventListener('click', fn);
    }
    document.addEventListener('click', fn)
}
localStorage.setItem('webagon-first-popup-seen', 'true')
