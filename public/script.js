
import LevelLoader from './gameContent/levelLoader';
import FragmentShader from './fragmentShader';
import Lerp from './utils/interpolation';

let level
(async () => {
    level = new LevelLoader();
    await level.init();

    // level.load(levelPaths[0])
})()
export default level

const loadLevel = path => level.load(path);

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

const levelPaths = [
    './levels/level1.js',
    './levels/level2.js',
    './levels/level3.js',
]

const levelList = document.getElementById('level-list');
levelPaths.forEach(levelPath => {
    levelList.insertAdjacentHTML('beforeend', `
        <div class="level-wrap">
            <div class="level">
                <p>Level Name</p>
                <button>${levelPath}</button>
            </div>
        </div>
    `)
    levelList.lastElementChild.addEventListener('click', () => {
        loadLevel(levelPath)
        document.getElementById('level-select').style.display = 'none'
    })
})

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') shiftLevelListPosition(-1)
    else if (e.key === 'ArrowRight' || e.key === 'd') shiftLevelListPosition(1)
    else if (e.key === 'Enter') loadLevel(levelPaths[levelListSelectedLevel])
})
let levelListSelectedLevel = 0
const levelListPositionXLerp = new Lerp(v => levelList.style.left = `${-v*100}vw`);

const shiftLevelListPosition = shift => {
    console.log(levelListSelectedLevel, shift)
    if ((levelListSelectedLevel === 0 && shift === -1)
    || (levelListSelectedLevel === levelPaths.length - 1 && shift === 1)) return
    levelListSelectedLevel += shift;  
    console.log(levelListSelectedLevel)
    levelListPositionXLerp.run(levelListSelectedLevel, 0.3, Lerp.Easing.EASE_OUT)
}

