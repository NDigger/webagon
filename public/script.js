
import * as PIXI from 'pixi.js'
import LevelLoader from './game/levelLoader';
import AudioManager from './utils/audioManager';
import LevelPreview from './game/levelPreview';
import './frameCounter';

import DrawHandler from './game/gameContent/drawHandler';
import Background from './game/gameContent/background';

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

const updateJSONPaths = (levelFolderPath, jsonLevelObject) => {
    const levelJson = structuredClone(jsonLevelObject);
    levelJson.scriptPath = `${levelFolderPath}/${levelJson.scriptPath}`
    levelJson.musicPath = `${levelFolderPath}/${levelJson.musicPath}`
    return levelJson
}

document.getElementById('play-btn').addEventListener('click', () => loadLevel(levelJsons[levelListSelectedLevel]))
const keyDownMenuListener = e => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        shiftLevelListPosition(-1)
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        shiftLevelListPosition(1)
    } else if (e.code === 'Enter') loadLevel(levelJsons[levelListSelectedLevel])

    if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        audioManager.resetPlay('level-select')
        backgroundTime = 0;
    }
}

const loadMenu = () => {
    document.addEventListener('keydown', keyDownMenuListener)
    levelPreview.load(levelJsons[levelListSelectedLevel].scriptPath)
    backgroundTime = 0;
}

let levelListSelectedLevel = 0
const getSelectedLevel = () => document.getElementById(`level-${levelJsons[levelListSelectedLevel].key}`);
const beforeShift = () => {
    const selectedLevel = getSelectedLevel();
    selectedLevel.classList.remove('selected-animation')
    void selectedLevel.offsetWidth;
    selectedLevel.classList.add('unselected-animation')
}
const selectedLevelInfo = document.getElementById('selected-level-info')
const afterShift = () => {
    const selectedLevel = getSelectedLevel();
    selectedLevel.classList.remove('unselected-animation');
    void selectedLevel.offsetWidth;
    selectedLevel.classList.add('selected-animation');

    levelPreview.load(levelJsons[levelListSelectedLevel].scriptPath)

    const currentJson = levelJsons[levelListSelectedLevel];
    selectedLevelInfo.querySelector('.title-name').textContent = currentJson.name
    selectedLevelInfo.querySelector('.name').textContent = `Name: ${currentJson.name}`
    selectedLevelInfo.querySelector('.author').textContent = `Author: ${currentJson.author}`
    selectedLevelInfo.querySelector('.description').textContent = `Description: ${currentJson.description}`
    selectedLevelInfo.querySelector('.music-name').textContent = `Name: ${currentJson.musicName || 'None'}`
    selectedLevelInfo.querySelector('.music-author').textContent = `Author: ${currentJson.musicAuthor || 'None'}`
    selectedLevelInfo.querySelector('.music-album').textContent = `Album: ${currentJson.musicAlbum || 'None'}`
    const scoresItem = localStorage.getItem('webagon-scores');
    const scores = scoresItem ? JSON.parse(scoresItem) : {}; 
    const safeScore =  scores[currentJson.key] ?? 0.0
    let zeros = ''
    if (parseFloat(safeScore) < 10) zeros = '00';
    else if (parseFloat(safeScore) < 100) zeros = '0';
    selectedLevelInfo.querySelector('.best').innerHTML = `<span style="opacity:.5">${zeros}</span>${safeScore}`
}

const shiftLevelListPosition = shift => {
    beforeShift()
    if (levelListSelectedLevel === 0 && shift === -1) levelListSelectedLevel = levelPaths.length - 1;
    else if (levelListSelectedLevel === levelPaths.length - 1 && shift === 1) levelListSelectedLevel = 0;
    else levelListSelectedLevel += shift;
    localStorage.setItem('webagon-selected-level', levelListSelectedLevel)
    afterShift()
}
const setLevelListPosition = position => {
    beforeShift();
    levelListSelectedLevel = position;
    localStorage.setItem('webagon-selected-level', levelListSelectedLevel)
    afterShift();
}

const levelsFolderPath = './levelsContent/levels';
const levelPaths = [
    `${levelsFolderPath}/level1`,
    `${levelsFolderPath}/level2`,
    `${levelsFolderPath}/level3`,
    `${levelsFolderPath}/level4`,
]
const levelJsons = []
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

        levelList.lastElementChild.addEventListener('click', e => {
            if (getSelectedLevel() !== e.currentTarget || (window.innerWidth < 1068 && !selectedLevelInfo.classList.contains('show'))) {
                audioManager.resetPlay('level-select')
                setLevelListPosition(i)
                selectedLevelInfo.classList.remove('hide');
                void selectedLevelInfo.offsetWidth
                selectedLevelInfo.classList.add('show');
            }
            else loadLevel(updatedJson)
        })

        requestAnimationFrame(() => setLevelListPosition(parseInt(localStorage.getItem('webagon-selected-level')) ?? 0));
        loadMenu();
    })
})

document.getElementById('close-selected-level-info').addEventListener('click', () => {
    selectedLevelInfo.classList.remove('show');
    void selectedLevelInfo.offsetWidth
    selectedLevelInfo.classList.add('hide');
    audioManager.resetPlay('level-select');
})