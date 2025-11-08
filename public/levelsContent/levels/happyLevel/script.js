
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    const ws = level.getWallSpeedMult();
    if (pKey === 0) await patterns.pDoubleInverseSpiral(9, ws * 25, ws * 50, 1);
    else if (pKey === 1) await patterns.pDoubleSpiral(Utils.mathRandom(7, 9), ws * 25, ws * 50, 1);
}

const pKeys = [0, 1];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setRadius(80);
    level.setRotationSpeed(0.1);
    level.setWallSpeedMult(3);
    level.setSides(6);
    level.set3dDepth(4);
    level.set3dDistance(3);
    level.setWallSpeedIncrement(0.25);
    level.setRotationSpeedIncrement(0.05);
    level.setIncrementTime(10);
    level.setBackgroundSwapTime(999999);
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    const colorTime = time;
    level.setBackgroundTileColors([
        Color.hsvToRgb(colorTime, 1., .4),
        Color.hsvToRgb(colorTime + 1/12, 1., .4),
        Color.hsvToRgb(colorTime + 2/12, 1., .4),
        Color.hsvToRgb(colorTime + 3/12, 1., .4),
        Color.hsvToRgb(colorTime + 2/12, 1., .4),
        Color.hsvToRgb(colorTime + 1/12, 1., .4),
    ])
    level.setOffset(new Vector2(Math.sin(time * 3) * 50, 0));
    level.setCenterOffset(new Vector2(0, Math.sin(time * 3) * 50));

    level.setMainColor(Color.hsvToRgb(colorTime, .1, 1))
    const s = 1 + Utils.pingPong(time) * .2
    level.setScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Utils.pingPong(time) * .2 + .5)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
