import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level);

const longBarrage = async (delay, delayEnd) => {
    for(let i = 0; i < level.getSides() - 1; i++) level.createWall(i, delay);
    await level.distanceDelay(delay);
    await level.distanceDelay(delayEnd);
}

const longAlt = async (delay, delayEnd) => {
    for(let i = 0; i < level.getSides() - 1; i += 2) level.createWall(i, delay);
    await level.distanceDelay(delay);
    await level.distanceDelay(delayEnd);
}

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    const d = 420 * Math.max(1, level.getWallSpeedMult() / 6);
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), d, d);
    else if (pKey === 1) await patterns.pRandomBarrage(Utils.mathRandom(4, 6), d * .7, d);
    else if (pKey === 2) await patterns.pAltBarrage(Utils.mathRandom(4, 5), d * .75, d);
    else if (pKey === 3) await patterns.pDoubleSpiral(Utils.mathRandom(5, 9), d * .5, d);
    else if (pKey === 4) await patterns.pWallExTunnel(Utils.mathRandom(4, 5), d * .75, d);
    else if (pKey === 5) await longBarrage(d * .5, d);
    else if (pKey === 6) await longAlt(d * .5, d);
    else if (pKey === 7) await patterns.pTunnel(Utils.mathRandom(3, 4), d * 1.4, d);
}

const enableSwapOnHighSpeed = () => level.getWallSpeedMult() * level.getDifficultyMult() > 5 && level.setSwapEnabled(true);

const pKeys = [0, 1, 1, 2, 3, 4, 5, 6, 7];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setRotationSpeed(0.2);
    level.setRotationSpeedMax(.5);
    level.setWallSpeedMult(2.8);
    level.setSides(6);
    level.set3dLayersCount(6);
    level.set3dDistance(25);
    level.setRadius(80);
    level.setWallSpeedIncrement(.1);
    level.setRotationSpeedIncrement(.02);
    level.set3dFalloffColor(new Color(0, 0, 0));
    level.setIncrementSpinPower(.4);
    level.set3dDepthMult(.5);
    level.set3dFalloffScale(new Vector2(.85, .85))

    enableSwapOnHighSpeed();
}

// onStep must be async and use delays in order to work. No delays may cause crash.
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
            new Color(255, 255, 255),
            new Color(250, 250, 250)
        ])
    const s = Utils.pingPong(level.getTime() * 6) * 25;
    level.setMainColor(new Color(255 - s, 255 - s, 255 - s))
    
    const v = 225 + Utils.pingPong(time * 1.05) * 30;
    level.setPolygonColor(new Color(v, v, v));
    
    const ws = Utils.pingPong(1-Utils.easeOut(Utils.fract(time * 1.05))) * .9 + 1;
    level.setWallScale(new Vector2(ws, ws));

    const value = Utils.pingPong(level.getTime()) * 100 + 50
    level.setFontColor(new Color(value, value, value));
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    const s = Utils.pingPong(time * 1.05) * .5 - .2;
    level.setSkew(s);
    level.set3dDepthMult(s * 3);
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => { enableSwapOnHighSpeed() }

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
