
import LevelLoader from './game/levelLoader';
import FragmentShader from './utils/fragmentShader';
import Lerp from './utils/interpolation';
import AudioManager from './utils/audioManager';

let level
let levelLoader
const audioManager = new AudioManager();
(async () => {
    levelLoader = new LevelLoader();
    await levelLoader.init();
    levelLoader.audioManager = audioManager;
    levelLoader.onLeave = () => loadMenu();
})()
export { level }
export function setLevel(v) {
    level = v
}

const loadLevel = levelData => {
    levelLoader.load(levelData);
    document.removeEventListener('keydown', keyDownMenuListener)
}


fetch('./shader.frag')
.then(res => res.text())
.then(frag => {
    const backgroundShader = new FragmentShader('level-select-background', frag);
    const render = time =>  {
        backgroundShader.setUniform('u_time', [time/1000]);
        requestAnimationFrame(render);
    }
    const setResolution = () => backgroundShader.setUniform('u_resolution', [window.innerWidth, window.innerHeight]);
    setResolution()
    window.addEventListener('resize', setResolution);
    requestAnimationFrame(render);
})

const levelsFolderPath = './levelsContent/levels';
const levelPaths = [
    `${levelsFolderPath}/level1`,
    `${levelsFolderPath}/level2`,
    `${levelsFolderPath}/level3`,
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
    })
})


const shiftLevelListPosition = shift => {
    if (levelListSelectedLevel === 0 && shift === -1) levelListSelectedLevel = levelPaths.length - 1;
    else if (levelListSelectedLevel === levelPaths.length - 1 && shift === 1) levelListSelectedLevel = 0;
    else levelListSelectedLevel += shift;  
    levelListPositionXLerp.run(levelListSelectedLevel, .3, Lerp.Easing.EASE_OUT)
}

const keyDownMenuListener = e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') shiftLevelListPosition(-1)
    else if (e.key === 'ArrowRight' || e.key === 'd') shiftLevelListPosition(1)
    else if (e.key === 'Enter') loadLevel(updateJsonPaths(levelJsons[levelListSelectedLevel]))
}

const loadMenu = () => document.addEventListener('keydown', keyDownMenuListener)
loadMenu();

let levelListSelectedLevel = 0
const levelListPositionXLerp = new Lerp(v => levelList.style.transform = `translateX(${-v*100}vw)`);


