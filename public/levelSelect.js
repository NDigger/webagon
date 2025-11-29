import LevelPreview from './game/levelPreview';
import Background from './game/gameContent/background';
import { app, setBestScore, sounds, levelLoader } from './script';
import { Color } from './utils/structures';

import { getLevelStats } from './storage';

const getKeydownEventsEnabled = () => document.getElementById('level-select').getAttribute('data-events-enabled') === 'true';

const selectedLevelTop = document.getElementById('selected-level-top')

const selectedLevelInfo = document.getElementById('selected-level')
const levelList = document.getElementById('level-list');

levelList.addEventListener('keydown', e => {
    if (!getKeydownEventsEnabled()) return
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});

levelLoader.onLeave = () => loadMenu();

// Menu background
const background = new Background(app);
background.setLayer(-999);

const levelPreview = new LevelPreview()
const levelPreviewUpdate = ft =>{
    const style = levelPreview.getStyle()
    background.setTileColors(style.backgroundTileColors);
    background.setRotation(style.rotation);
    background.setDarkenUnevenChunkEnabled(style.backgroundDarkenUnevenChunkEnabled);
    background.setSwapTime(style.backgroundSwapTime);
    document.documentElement.style.setProperty('--main-color', style.fontColor ? style.fontColor.getRGBAStyle() : style.mainColor.getRGBAStyle());
    background.setSides(style.sides);
    background.draw();
}

const loadLevel = levelData => {
    levelPreview.drop();
    sounds.levelLoad.play();
    levelLoader.start(levelData, getSelectedDifficultyMult());
    document.removeEventListener('keydown', keyDownMenuListener)

    levelPreview.onUpdate = () => {}
    background.setTileColors([new Color(0, 0, 0, 0)]);
    background.draw();
}

const loadMenu = () => {
    levelPreview.onUpdate = ft => levelPreviewUpdate(ft);
    document.addEventListener('keydown', keyDownMenuListener)
    const path = getSelectedLevelJSON()?.scriptPath ?? undefined
    if (path != undefined) levelPreview.load(path)
}

const levelJsons = []
const getSelectedLevelJSON = () => levelJsons[selectedLevelIndex];

const loadLevels = () => {
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
                    sounds.levelSelect.play();
                    setLevelListPosition(i);
                    selectedLevelInfo.classList.remove('hide');
                    void selectedLevelInfo.offsetWidth;
                    selectedLevelInfo.classList.add('show');
                }
                else loadLevel(updatedJson);
            })

            requestAnimationFrame(() => setLevelListPosition(parseInt(localStorage.getItem('webagon-selected-level') ?? 0)));
                loadMenu();
            })
        })
    })
}

loadLevels();

let selectedLevelIndex = 0
const getSelectedLevelElement = () => document.getElementById(`level-${getSelectedLevelJSON()?.key}`);
const beforeShift = () => {
    const selectedLevelElement = getSelectedLevelElement();
    if (selectedLevelElement == undefined) return
    selectedLevelElement.classList.remove('selected-animation');
    // void selectedLevelElement.offsetWidth;
    // selectedLevelElement.classList.add('unselected-animation');
}

let avaliableDifficulties = [1];
let selectedDifficultyIndex = 0;

const getSelectedDifficultyMult = () => avaliableDifficulties[selectedDifficultyIndex]

const selectedLevelDifficultyElement = document.getElementById('selected-level-difficulty');
const shiftDifficulty = shift => {
    selectedDifficultyIndex = (selectedDifficultyIndex + shift + avaliableDifficulties.length) % avaliableDifficulties.length;
    selectedLevelDifficultyElement.textContent = `${getSelectedDifficultyMult()}x`
    const levelStats = getLevelStats(getSelectedLevelJSON().key, getSelectedDifficultyMult());
    const selectedLevelJSON = getSelectedLevelJSON();
    const best = levelStats?.best ?? 0;
    setBestScore(selectedLevelJSON.completable ? `${best*100}%` : best);
    animateSelectedLevelTop();
    sounds.levelSelect.play();
}

document.getElementById('difficulty-change-arrow-left').addEventListener('click', () => shiftDifficulty(-1));
document.getElementById('difficulty-change-arrow-right').addEventListener('click', () => shiftDifficulty(1));

const animateSelectedLevelTop = () => {
    selectedLevelTop.classList.remove('animate');
    void selectedLevelTop.offsetWidth;
    selectedLevelTop.classList.add('animate');
}

const updateSelectedLevelInfo = () => {
    const currentJson = getSelectedLevelJSON();
    selectedLevelInfo.querySelector('.title-name').textContent = currentJson?.name
    // selectedLevelInfo.querySelector('.name').textContent = `Name: ${currentJson?.name || 'Unnamed'}`
    // selectedLevelInfo.querySelector('.author').textContent = `Author: ${currentJson?.author || 'None'}`
    // selectedLevelInfo.querySelector('.description').textContent = `Description: ${currentJson?.description || 'None'}`
    selectedLevelInfo.querySelector('.music-name').textContent = `Name: ${currentJson?.musicName || 'None'}`
    selectedLevelInfo.querySelector('.music-author').textContent = `Author: ${currentJson?.musicAuthor || 'None'}`
    selectedLevelInfo.querySelector('.music-album').textContent = `Album: ${currentJson?.musicAlbum || 'None'}`
}

const afterShift = () => {
    const selectedLevelElement = getSelectedLevelElement();
    if (selectedLevelElement == undefined) return
    // selectedLevelElement.classList.remove('unselected-animation');
    // void selectedLevelElement.offsetWidth;
    selectedLevelElement.classList.add('selected-animation');
    selectedLevelElement.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    
    const currentJson = getSelectedLevelJSON();
    levelPreview.load(currentJson.scriptPath)

    updateSelectedLevelInfo()

    selectedLevelDifficultyElement.textContent = '1x';
    avaliableDifficulties = [1, ...currentJson?.difficulties ?? []].sort((a, b) => a - b)
    selectedDifficultyIndex = avaliableDifficulties.findIndex(v => v === 1);
    
    const levelStats = getLevelStats(currentJson.key, getSelectedDifficultyMult());
    const best = levelStats?.best ?? 0;
    setBestScore(currentJson?.completable ? `${best * 100}%` : best)

    animateSelectedLevelTop();
}

const shiftLevelListPosition = shift => {
    beforeShift()
    if (selectedLevelIndex === 0 && shift === -1) selectedLevelIndex = levelJsons.length - 1;
    else if (selectedLevelIndex === levelJsons.length - 1 && shift === 1) selectedLevelIndex = 0;
    else selectedLevelIndex += shift;
    localStorage.setItem('webagon-selected-level', selectedLevelIndex ?? 0)
    afterShift()
}

const setLevelListPosition = position => {
    beforeShift();
    selectedLevelIndex = position;
    localStorage.setItem('webagon-selected-level', selectedLevelIndex ?? 0)
    afterShift();
}

const levelSelectElement = document.getElementById('level-select');
const keyDownMenuListener = e => {
    // if (e.code === 'Escape') {
    //     if (keydownEventsEnabled === true) {
    //         levelSelectElement.style.display = 'none';
    //         keydownEventsEnabled = false;
    //         setSettingsVisible(true);
    //     }
    //     else {
    //         keydownEventsEnabled = true;
    //         setSettingsVisible(false);
    //         void levelList.offsetWidth;
    //         levelSelectElement.style.display = 'flex';
    //     }
    // }

    if (!getKeydownEventsEnabled()) return
    if (e.code === 'ArrowUp' || e.code === 'KeyW') shiftLevelListPosition(-1)
    else if (e.code === 'ArrowDown' || e.code === 'KeyS') shiftLevelListPosition(1)
    else if (e.code === 'ArrowLeft' || e.code === 'KeyA') shiftDifficulty(-1)
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') shiftDifficulty(1)

    else if (e.code === 'Enter') loadLevel(getSelectedLevelJSON())

    if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        sounds.levelSelect.play()
    }
}

const playBtn = document.getElementById('play-btn')
playBtn.addEventListener('click', () => loadLevel(getSelectedLevelJSON()))
document.getElementById('selected-level').addEventListener('click', e => {
    if (e.target === playBtn) return
    selectedLevelInfo.classList.remove('show');
    void selectedLevelInfo.offsetWidth
    selectedLevelInfo.classList.add('hide');
    sounds.levelSelect.play();
})