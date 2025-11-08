
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(3, 4), 500, 500);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), 300, 500);
    else if (pKey === 2) await patterns.pDoubleSpiral(Utils.mathRandom(7, 9), 120, 500, 2);
    else if (pKey === 3) await patterns.pTunnel(Utils.mathRandom(2, 3), 600, 500);
    else if (pKey === 4) await patterns.pAltBarrage(Utils.mathRandom(3, 4), 300, 500);
}

const pKeys = [0, 1, 2, 3, 4];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    // g.setBackgroundRadius(500);
    level.setSwapEnabled(true);
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(80);
    level.setRotationSpeed(0.04);
    level.setWallSpeedMult(2);
    level.setSides(8);
    level.set3dDepth(3);
    level.set3dDistance(500);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.015);
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
    const colorTime = time / 12;
    level.setBackgroundTileColors([
        Color.hsvToRgb(colorTime, .0, 1),
        Color.hsvToRgb(colorTime, .05, 1),
    ])

    level.setMainColor(Color.hsvToRgb(colorTime, 1, 1))

    // Imitating level pulse with pingPong function
    const s = Utils.pingPong(time * 2.2) * .1 + 1
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Utils.pingPong(time/10)/2)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
