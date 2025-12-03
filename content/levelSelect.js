import LevelPreview from './game/levelPreview';
import { setBestScore, sounds, levelLoader, getPublicURL } from './script';

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

// let levelPreview = new LevelPreview()
let levelPreview;

// setTimeout(() => levelPreview.destroy(), 300);
const loadLevel = levelData => {
    levelPreview.destroy();
    sounds.levelLoad.play();
    levelLoader.start(levelData, getSelectedDifficultyMult());
    document.removeEventListener('keydown', keyDownMenuListener)
}

const loadMenu = () => {
    levelPreview = new LevelPreview();
    document.addEventListener('keydown', keyDownMenuListener)
    const levelPath = getSelectedLevelJSON()?.levelPath
    levelPreview.load(levelPath)
}

const levelJsons = []
const getSelectedLevelJSON = () => levelJsons[selectedLevelIndex];

const loadLevels = () => {
    fetch(getPublicURL() + '/levelPaths.json')
    .then(res => res.json())
    .then(async levelPaths => {
        await Promise.all(
            levelPaths.map(async (levelPath, i) => {
                const res = await fetch(`${getPublicURL()}${levelPath}/data.json`);
                const d = await res.json();
                const updateJSONPath = jsonLevelObject => {
                    const levelJson = structuredClone(jsonLevelObject);
                    levelJson.levelPath = levelPath;
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
            })
        )

        loadMenu();
        setLevelListPosition(parseInt(localStorage.getItem('webagon-selected-level') ?? 0));
    })
}

loadLevels();

let selectedLevelIndex = 0
const getSelectedLevelElement = () => document.getElementById(`level-${getSelectedLevelJSON()?.key}`);
const beforeShift = () => {
    const selectedLevelElement = getSelectedLevelElement();
    if (selectedLevelElement == undefined) return
    selectedLevelElement.classList.remove('selected-animation');
    void selectedLevelElement.offsetWidth;
    selectedLevelElement.classList.add('unselected-animation');
}

let avaliableDifficulties = [1];
let selectedDifficultyIndex = 0;

const getSelectedDifficultyMult = () => avaliableDifficulties[selectedDifficultyIndex]

const getRoundPercent = percent => Math.floor(percent * 10000) / 10000;

const selectedLevelDifficultyElement = document.getElementById('selected-level-difficulty');
const shiftDifficulty = shift => {
    selectedDifficultyIndex = (selectedDifficultyIndex + shift + avaliableDifficulties.length) % avaliableDifficulties.length;
    selectedLevelDifficultyElement.textContent = `${getSelectedDifficultyMult()}x`
    const levelStats = getLevelStats(getSelectedLevelJSON().key, getSelectedDifficultyMult());
    const selectedLevelJSON = getSelectedLevelJSON();
    const best = levelStats?.best ?? 0;
    setBestScore(selectedLevelJSON?.completable ? getRoundPercent(best) : best, selectedLevelJSON?.completable);
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
    selectedLevelElement.classList.remove('unselected-animation');
    void selectedLevelElement.offsetWidth;
    selectedLevelElement.classList.add('selected-animation');
    selectedLevelElement.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    
    const currentJson = getSelectedLevelJSON();
    levelPreview.load(currentJson.levelPath);

    updateSelectedLevelInfo()

    selectedLevelDifficultyElement.textContent = '1x';
    avaliableDifficulties = [1, ...currentJson?.difficulties ?? []].sort((a, b) => a - b)
    selectedDifficultyIndex = avaliableDifficulties.findIndex(v => v === 1);
    
    const levelStats = getLevelStats(currentJson.key, getSelectedDifficultyMult());
    const best = levelStats?.best ?? 0;
    setBestScore(currentJson?.completable ? getRoundPercent(best) : best, currentJson?.completable);

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

const keyDownMenuListener = e => {
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

const playBtn = document.getElementById('play-btn');
const difficultyContainer = document.querySelector('#selected-level .difficulty-container');
playBtn.addEventListener('click', () => loadLevel(getSelectedLevelJSON()))
document.getElementById('selected-level').addEventListener('click', e => {
    if ([playBtn, ...Array.from(difficultyContainer.children)].includes(e.target)) return
    selectedLevelInfo.classList.remove('show');
    void selectedLevelInfo.offsetWidth
    selectedLevelInfo.classList.add('hide');
    const isMobile = window.matchMedia("(max-width: 1068px)").matches;
    if (isMobile) sounds.levelSelect.play();
})