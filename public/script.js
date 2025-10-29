
import * as PIXI from 'pixi.js'
import LevelLoader from './game/levelLoader';
import Lerp from './utils/interpolation';
import AudioManager from './utils/audioManager';
import LevelPreview from './game/levelPreview';
import './frameCounter';

import DrawHandler from './game/gameContent/drawHandler';
import Background from './game/gameContent/background';
import { Color, Vector2 } from './utils/structures';

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

const audioManager = new AudioManager();
audioManager.add('level-select', new Audio('audio/levelSelect.mp3'))
audioManager.setStartTime('level-select', .12)

let level
let levelLoader
let background = null;
(async () => {
    const app = await createApp()
    levelLoader = new LevelLoader(app);
    levelLoader.onLeave = () => loadMenu();
    background = new Background({pixiApp: app, drawHandler: new DrawHandler()})
    background.setTileColors([
        new Color(55, 0, 0),
        new Color(85, 0, 0)
    ])
    background.setLayer(-999);
})()
export { level }
export function setLevel(v) {
    level = v
}

const levelPreview = new LevelPreview()
let backgroundTime;
levelPreview.onUpdate = ft => {
    backgroundTime += ft;
    if (background == null) return
    const style = levelPreview.getStyle()
    background.setTileColors(style.backgroundTileColors)
    background.setRotation(backgroundTime * style.rotationSpeed * 1000)
    document.documentElement.style.setProperty('--font-color', style.mainColor.getRGBAStyle());
    background.setSides(style.sides);
}

const loadLevel = levelData => {
    levelPreview.drop();
    document.getElementById('level-select').style.display = 'none'
    levelLoader.load(levelData);
    document.removeEventListener('keydown', keyDownMenuListener)
}

const levelsFolderPath = './levelsContent/levels';
const levelPaths = [
    `${levelsFolderPath}/level1`,
    `${levelsFolderPath}/level2`,
    `${levelsFolderPath}/level3`,
    `${levelsFolderPath}/level4`,
]
const levelJsons = []

const updateJSONPaths = (levelFolderPath, jsonLevelObject) => {
    const levelJson = structuredClone(jsonLevelObject);
    levelJson.scriptPath = `${levelFolderPath}/${levelJson.scriptPath}`
    levelJson.musicPath = `${levelFolderPath}/${levelJson.musicPath}`
    return levelJson
}

const levelList = document.getElementById('level-list');
levelPaths.forEach((levelPath, i) => {
    fetch(`${levelPath}/data.json`)
    .then(res => res.json())
    .then(d => {
        const updatedJson = updateJSONPaths(levelPath, d)
        levelJsons.push(updatedJson);

        const scoresItem = localStorage.getItem('webagon-scores');
        const scores = scoresItem ? JSON.parse(scoresItem) : {}; 
        levelList.insertAdjacentHTML('beforeend', `
            <div class="level" id="level-${d.key}">
                <p class="name">${d.name}</p>
                <p class="author">${d.author}</p>
            </div>
        `)
        // <p class="description">${d.description}</p>
        //         <p class="author">${d.author}</p>
        //         <p class="best">${scores[d.key] ? scores[d.key] : 0.000}</p>

        levelList.lastElementChild.addEventListener('click', e => {
            if (getSelectedLevel() !== e.currentTarget) setLevelListPosition(i)
            else loadLevel(updatedJson)
        })

        setLevelListPosition(0);
        loadMenu();
    })
})


const getTranslateX = element => {
    const style = window.getComputedStyle(element);
    const matrix = new DOMMatrix(style.transform);
    return matrix.m41
}
const getLevelLerpSetter = element => v => element.style.transform = `translateX(${v}px) skewX(-20deg)`
const getSelectedLevel = () => document.getElementById(`level-${levelJsons[levelListSelectedLevel].key}`);
const beforeShift = () => {
    const selectedLevel = getSelectedLevel();
    new Lerp(getLevelLerpSetter(selectedLevel))
    .apply(getTranslateX(selectedLevel))
    .run(0, .3, Lerp.Easing.EASE_IN)
}
const afterShift = () => {
    const selectedLevel = getSelectedLevel();
    new Lerp(getLevelLerpSetter(selectedLevel))
    .apply(getTranslateX(selectedLevel))
    .run(100, .3, Lerp.Easing.EASE_OUT)
}
const shiftLevelListPosition = shift => {
    beforeShift()
    if (levelListSelectedLevel === 0 && shift === -1) levelListSelectedLevel = levelPaths.length - 1;
    else if (levelListSelectedLevel === levelPaths.length - 1 && shift === 1) levelListSelectedLevel = 0;
    else levelListSelectedLevel += shift;
    afterShift()
}
const setLevelListPosition = position => {
    beforeShift();
    levelListSelectedLevel = position;
    afterShift();
}

const keyDownMenuListener = e => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        shiftLevelListPosition(-1)
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        shiftLevelListPosition(1)
    } else if (e.code === 'Enter') loadLevel(levelJsons[levelListSelectedLevel])

    if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        audioManager.resetPlay('level-select')
        levelPreview.load(levelJsons[levelListSelectedLevel].scriptPath)
        backgroundTime = 0;
    }
}

let levelListSelectedLevel = 0
const loadMenu = () => {
    document.addEventListener('keydown', keyDownMenuListener)
    levelPreview.load(levelJsons[levelListSelectedLevel].scriptPath)
    backgroundTime = 0;
}