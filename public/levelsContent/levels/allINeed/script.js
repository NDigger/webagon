import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level);

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 350, 400);
    else if (pKey === 1) await patterns.pRandomBarrage(Utils.mathRandom(4, 6), 170, 400);
    else if (pKey === 2) await patterns.pAltBarrage(Utils.mathRandom(4, 5), 250, 400, 1);
    else if (pKey === 3) await patterns.pDoubleSpiral(Utils.mathRandom(5, 9), 100, 400);
    else if (pKey === 4) await patterns.pWallExTunnel(Utils.mathRandom(4, 5), 270, 400);
}

const pKeys = [0, 1, 1, 1, 2, 3, 4];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setRotationSpeed(0.335);
    level.setWallSpeedMult(2.8);
    level.setSides(6);
    level.set3dLayersCount(6);
    level.set3dDistance(25);
    level.setRadius(80);
    level.setWallSpeedIncrement(.1);
    level.setRotationSpeedIncrement(.035);
    level.set3dFalloffColor(new Color(0, 0, 0));
    level.setIncrementSpinPower(.4);
    level.set3dDepthMult(.5);
    level.set3dFalloffScale(new Vector2(.85, .85))
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
    level.setMainColor(new Color(255, 255, 255))
    const v = 225 + Utils.pingPong(time * 1.05) * 30;
    level.setPolygonColor(new Color(v, v, v));
    
    const s = Utils.pingPong(1-Utils.easeOut(Utils.fract(time * 1.05))) * .9 + 1;
    level.setWallScale(new Vector2(s, s));

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
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
