
import LevelLoader from './gameContent/levelLoader';
import FragmentShader from './fragmentShader';

let level
(async () => {
    level = new LevelLoader();
    await level.init();

    level.load(levelPaths[0])
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
]

const levelsListDiv = document.getElementById('levels-list');
levelPaths.forEach(levelPath => {
    levelsListDiv.insertAdjacentHTML('beforeend', `
        <button>${levelPath}</button>
    `)
    levelsListDiv.lastElementChild.addEventListener('click', () => {
        loadLevel(levelPath)
        document.getElementById('level-select').style.display = 'none'
    })
})
