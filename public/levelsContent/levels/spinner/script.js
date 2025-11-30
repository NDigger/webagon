
import { Vector2, Color, Size, level } from '../../common'
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
    level.set3dLayersCount(2);
    level.set3dDistance(6);
    level.setWallSpeedIncrement(0.25);
    level.setRotationSpeedIncrement(0.05);
    level.setRotationSpeedMax(0.5);
    level.setIncrementTime(10);
    level.setIncrementSpinPower(.5)
    level.setBackgroundSwapTime(999999);
    level.set3dFalloffScale(new Vector2(1, 1));
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

// onUpdate is called every frame.
level.onUpdate = ft => {
    const time = level.getTime();
    const colorTime = time;
    level.setBackgroundTileColors([
        Color.hsvToRgb(colorTime, .6, .5),
        Color.hsvToRgb(colorTime + 2/12, .5, .6),
        Color.hsvToRgb(colorTime + 4/12, .4, .7),
        Color.hsvToRgb(colorTime + 6/12, .3, .8),
        Color.hsvToRgb(colorTime + 4/12, .4, .7),
        Color.hsvToRgb(colorTime + 2/12, .5, .6),
    ])
    // level.setOffset(new Vector2(Math.sin(time * 300) * 1000, 0));
    level.setCenterOffset(new Vector2(Math.cos(level.getRotation() * 0.01) * 100, Math.sin(level.getRotation() * 0.01) * 100));

    level.setMainColor(Color.hsvToRgb(colorTime, 0, 1));

    level.set3dColor(Color.hsvaToRgba(colorTime, 0, 1, 55));
    
    const s = 1 - Utils.pingPong(time) * .1;
    level.setScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()) * .2 + .5)
    level.set3dDepthMult(level.getSkew() / 2);
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
