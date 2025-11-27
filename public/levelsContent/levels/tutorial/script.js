
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    const d = 400;
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), d*1.5, d*1.5);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), d, d*1.5);
    else if (pKey === 2) await patterns.pSpiral(Utils.mathRandom(6, 8), d/4, d)
    else if (pKey === 3) await patterns.pAltBarrage(Utils.mathRandom(3, 5), d, d*1.5)
}

let pKeys = [];
let activeKeys = [];

let extraIncMsg = false;
// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setBackgroundTileColors([
        new Color(255, 255, 255),
        new Color(255, 255, 245),
        new Color(255, 255, 255),
        new Color(255, 255, 235),
    ])

    level.setRadius(70);
    level.setRotationSpeed(0.01);
    level.setSides(6);
    level.set3dLayersCount(5);
    level.set3dDistance(10);
    level.setWallSpeedMult(1.2);
    level.setWallSpeedIncrement(0.1);
    level.setRotationSpeedIncrement(0.006);
    level.setWallSkewLeft(10);
    level.setBackgroundRadius(40000);
    level.setMainColor(new Color(0, 0, 55));
    level.setCompletionTime(88);
    level.setPlayerSwapReloadTime(0.4);

    console.log(level.getAttempt())
    if (level.getDifficultyMult() === 1 && level.getAttempt() === 1) {
        level.showMessage('Welcome!', 2);

        level.createEvent(2, () => level.showMessage('To move use left and right arrows.', 3));
        level.createEvent(5, () => level.showMessage('Try it out.', 2));
        level.createEvent(10, () => level.showMessage('Avoid walls!', 3));
        
        level.createEvent(30, () => level.showMessage('Get 60 seconds to complete the tutorial.', 4));
        level.createEvent(60, () => extraIncMsg = true);

        level.createEvent(12, () => pKeys = [0, 1, 2, 3]);
    } else if (level.getDifficultyMult() === 1 && level.getAttempt() !== 1) {
        level.createEvent(0, () => level.showMessage('Get 60 seconds to complete the tutorial.', 4));
        level.createEvent(60, () => extraIncMsg = true);
    } else if (level.getDifficultyMult() === 2.5) {
        level.showMessage('This is harder version of tutorial!', 2);
        level.createEvent(2, () => level.showMessage('Get 88 seconds to complete!', 2));
    } else if (level.getDifficultyMult() === 5) {
        level.setSwapEnabled(true);
        level.createEvent(15, () => level.showMessage('Good luck!', 2))
    }

    if (level.getDifficultyMult() !== 1 || level.getAttempt() !== 1) pKeys = [0, 1, 2, 3];
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
    await level.distanceDelay(0);
}

// onUpdate is called every frame.
level.onUpdate = ft => {
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()*.2)*.2)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {
    if (!extraIncMsg) return
    level.setIncrementTime(99999);
    extraIncMsg = false;
    pKeys = [];
    activeKeys = [];
    level.showMessage('Tutorial complete!', 2)
    const t = level.getTime();
    level.createEvent(t + 2, () => {
        level.showMessage('Before it\'s over, try to swap using "Space"!', 3);
        level.setSwapEnabled(true);
    })
    level.createEvent(t + 8, () => level.showMessage('You will find swap useful in future levels.', 3))

    level.createEvent(t + 11, () => level.showMessage('Levels have various difficulties. \nTry to change tutorial level difficulty in level select when tutorial is over!', 80))
}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
