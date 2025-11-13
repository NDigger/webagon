import LevelPreview from './game/levelPreview';
import Background from './game/gameContent/background';
import { app, setBestScore, audioManager, levelLoader } from './script';
import { Color } from './utils/structures';

import { getLevelStats, writeLevelStats } from './storage';

const selectedLevelTop = document.getElementById('selected-level-top')

const selectedLevelInfo = document.getElementById('selected-level')
const levelList = document.getElementById('level-list');

levelList.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});

levelLoader.onLeave = () => loadMenu();

// Menu background
const background = new Background(app);
background.setLayer(-999);
let backgroundTime;

const levelPreview = new LevelPreview()
const levelPreviewUpdate = ft =>{
    backgroundTime += ft;
    const style = levelPreview.getStyle()
    background.setTileColors(style.backgroundTileColors);
    background.setRotation(backgroundTime * style.rotationSpeed * 1000);
    background.setDarkenUnevenChunkEnabled(style.backgroundDarkenUnevenChunkEnabled);
    background.setSwapTime(style.backgroundSwapTime);
    document.documentElement.style.setProperty('--main-color', style.mainColor.getRGBAStyle());
    background.setSides(style.sides);
    background.draw();
}

const loadLevel = levelData => {
    levelPreview.drop();
    audioManager.resetPlay('level-load');
    document.getElementById('level-select').style.display = 'none'
    levelLoader.start(levelData);
    document.removeEventListener('keydown', keyDownMenuListener)

    levelPreview.onUpdate = () => {}
    background.setTileColors([new Color(0, 0, 0, 0)]);
    background.draw();
}

const loadMenu = () => {
    levelPreview.onUpdate = ft => levelPreviewUpdate(ft);
    document.addEventListener('keydown', keyDownMenuListener)
    const path = levelJsons[levelListSelectedLevel]?.scriptPath ?? undefined
    if (path != undefined) levelPreview.load(path)
    backgroundTime = 0;
}

const levelJsons = []
fetch('./levelPaths.json')
.then(res => res.json())
.then(levelPaths => {
    levelPaths.forEach((levelPath, i) => {
    fetch(`${levelPath}/data.json`)
    .then(res => res.json())
    .then(d => {
        const updateJSONPath = jsonLevelObject => {
            const levelJson = structuredClone(jsonLevelObject);
            levelJson.scriptPath = `${levelPath}/${levelJson.scriptPath}`
            levelJson.musicPath = `${levelPath}/${levelJson.musicPath}`
            return levelJson
        }

        const updatedJson = updateJSONPath(d)
        levelJsons.push(updatedJson);

        levelList.insertAdjacentHTML('beforeend', `
            <div class="level" id="level-${d.key}">
                <p class="name">${d.name}</p>
                <p class="author">${d.author}</p>
            </div>
        `)

        levelList.lastElementChild.addEventListener('click', e => {
            if (getSelectedLevelElement() !== e.currentTarget || (window.innerWidth < 1068 && !selectedLevelInfo.classList.contains('show'))) {
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
})

let levelListSelectedLevel = 0
const getSelectedLevelElement = () => document.getElementById(`level-${levelJsons[levelListSelectedLevel]?.key}`);
const beforeShift = () => {
    const selectedLevelElement = getSelectedLevelElement();
    if (selectedLevelElement == undefined) return
    selectedLevelElement.classList.remove('selected-animation')
    void selectedLevelElement.offsetWidth;
    selectedLevelElement.classList.add('unselected-animation')
}
const afterShift = () => {
    const selectedLevelElement = getSelectedLevelElement();
    if (selectedLevelElement == undefined) return
    selectedLevelElement.classList.remove('unselected-animation');
    void selectedLevelElement.offsetWidth;
    selectedLevelElement.classList.add('selected-animation');
    
    selectedLevelElement.scrollIntoView({ behavior: 'instant', block: 'nearest' })

    levelPreview.load(levelJsons[levelListSelectedLevel].scriptPath)

    const currentJson = levelJsons[levelListSelectedLevel];
    selectedLevelInfo.querySelector('.title-name').textContent = currentJson.name
    selectedLevelInfo.querySelector('.name').textContent = `Name: ${currentJson.name || 'None'}`
    selectedLevelInfo.querySelector('.author').textContent = `Author: ${currentJson.author || 'None'}`
    selectedLevelInfo.querySelector('.description').textContent = `Description: ${currentJson.description || 'None'}`
    selectedLevelInfo.querySelector('.music-name').textContent = `Name: ${currentJson.musicName || 'None'}`
    selectedLevelInfo.querySelector('.music-author').textContent = `Author: ${currentJson.musicAuthor || 'None'}`
    selectedLevelInfo.querySelector('.music-album').textContent = `Album: ${currentJson.musicAlbum || 'None'}`
    const levelStats = getLevelStats(currentJson.key);
    setBestScore(levelStats?.best ?? 0)

    selectedLevelTop.classList.remove('animate')
    void selectedLevelTop.offsetWidth;
    selectedLevelTop.classList.add('animate')
}

const shiftLevelListPosition = shift => {
    beforeShift()
    if (levelListSelectedLevel === 0 && shift === -1) levelListSelectedLevel = levelJsons.length - 1;
    else if (levelListSelectedLevel === levelJsons.length - 1 && shift === 1) levelListSelectedLevel = 0;
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

const keyDownMenuListener = e => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') shiftLevelListPosition(-1)
    else if (e.code === 'ArrowDown' || e.code === 'KeyS') shiftLevelListPosition(1)
    else if (e.code === 'Enter') loadLevel(levelJsons[levelListSelectedLevel])

    if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        audioManager.resetPlay('level-select')
        backgroundTime = 0;
    }
}

const playBtn = document.getElementById('play-btn')
playBtn.addEventListener('click', () => loadLevel(levelJsons[levelListSelectedLevel]))
document.getElementById('selected-level').addEventListener('click', e => {
    if (e.target === playBtn) return
    selectedLevelInfo.classList.remove('show');
    void selectedLevelInfo.offsetWidth
    selectedLevelInfo.classList.add('hide');
    audioManager.resetPlay('level-select');
})