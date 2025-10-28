
import * as PIXI from 'pixi.js'
import LevelLoader from './game/levelLoader';
import FragmentShader from './utils/fragmentShader';
import Lerp from './utils/interpolation';
import AudioManager from './utils/audioManager';
import LevelPreview from './game/levelPreview';

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

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function loop() {
  frameCount++;
  const now = performance.now();
  const delta = now - lastTime;

  if (delta >= 1000) {
    fps = (frameCount * 1000) / delta;
    frameCount = 0;
    lastTime = now;
    console.log('FPS:', fps.toFixed(1));
  }

  requestAnimationFrame(loop);
}

loop();

let level
let levelLoader
let background = null;
const audioManager = new AudioManager();
(async () => {
    const app = await createApp()
    levelLoader = new LevelLoader(app);
    levelLoader.audioManager = audioManager;
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
    levelLoader.load(levelData);
    levelPreview.drop();
    document.removeEventListener('keydown', keyDownMenuListener)
}

// fetch('./shader.frag')
// .then(res => res.text())
// .then(frag => {
//     const backgroundShader = new FragmentShader('level-select-background', frag);
//     const render = time =>  {
//         backgroundShader.setUniform('u_time', [time/1000]);
//         requestAnimationFrame(render);
//     }
//     const setResolution = () => backgroundShader.setUniform('u_resolution', [window.innerWidth, window.innerHeight]);
//     setResolution()
//     window.addEventListener('resize', setResolution);
//     requestAnimationFrame(render);
// })

const levelsFolderPath = './levelsContent/levels';
const levelPaths = [
    `${levelsFolderPath}/level1`,
    `${levelsFolderPath}/level2`,
    `${levelsFolderPath}/level3`,
    `${levelsFolderPath}/level4`,
]
const levelJsons = []

const updateJsonPaths = jsonLevelObject => {
    const levelJson = structuredClone(jsonLevelObject);
    levelJson.scriptPath = `${levelPaths[levelListSelectedLevel]}/${levelJson.scriptPath}`
    levelJson.musicPath = `${levelPaths[levelListSelectedLevel]}/${levelJson.musicPath}`
    return levelJson
}
const levelList = document.getElementById('level-list');
levelPaths.forEach(levelPath => {
    fetch(`${levelPath}/data.json`)
    .then(res => res.json())
    .then(d => {
        levelJsons.push(d);
        levelList.insertAdjacentHTML('beforeend', `
            <div class="level-wrap">
                <div class="level">
                    <p class="name">${d.name}</p>
                    <p class="description">${d.description}</p>
                    <p class="author">${d.author}</p>
                    <p class="best">31.145</p>
                </div>
            </div>
        `)

        levelList.lastElementChild.querySelector('.level').addEventListener('click', () => {
            loadLevel(updateJsonPaths(d))
            document.getElementById('level-select').style.display = 'none'
        })

        loadMenu();
    })
})


const shiftLevelListPosition = shift => {
    if (levelListSelectedLevel === 0 && shift === -1) levelListSelectedLevel = levelPaths.length - 1;
    else if (levelListSelectedLevel === levelPaths.length - 1 && shift === 1) levelListSelectedLevel = 0;
    else levelListSelectedLevel += shift;  
    levelListPositionXLerp.run(levelListSelectedLevel, .3, Lerp.Easing.EASE_OUT)
}

const keyDownMenuListener = e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        shiftLevelListPosition(-1)
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        shiftLevelListPosition(1)
    } else if (e.key === 'Enter') loadLevel(updateJsonPaths(levelJsons[levelListSelectedLevel]))

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') 
        levelPreview.load(updateJsonPaths(levelJsons[levelListSelectedLevel]).scriptPath)
        backgroundTime = 0;
}

let levelListSelectedLevel = 0
const levelListPositionXLerp = new Lerp(v => levelList.style.transform = `translateX(${-v*100}vw)`);

const loadMenu = () => {
    document.addEventListener('keydown', keyDownMenuListener)
    levelPreview.load(updateJsonPaths(levelJsons[levelListSelectedLevel]).scriptPath)
    backgroundTime = 0;
}