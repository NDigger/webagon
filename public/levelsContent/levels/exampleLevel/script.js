
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 500, 300);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), 300, 300);
    else if (pKey === 2) await patterns.pSpiral(Utils.mathRandom(7, 9), 100, 300, 1);
    else if (pKey === 3) await patterns.pRandomBarrage(Utils.mathRandom(3, 4), 300, 400);
    else if (pKey === 4) await patterns.pTunnel(Utils.mathRandom(2, 3), 700, 600);
}

const pKeys = [0, 1, 2, 3, 4];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    // g.setBackgroundRadius(500);
    level.setSwapEnabled(true);
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(70);
    level.setRotationSpeed(0.035);
    level.setWallSpeedMult(2);
    level.setSides(6);
    level.set3dDepth(4);
    level.set3dDistance(50);
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
    const colorTime = time / 4;
    level.setBackgroundTileColors([
        Color.hsvToRgb(colorTime, 1., .3),
        Color.hsvToRgb(colorTime, 1., .4),
    ])

    level.setMainColor(Color.hsvToRgb(colorTime, 1, 1))

    // Imitating level pulse with pingPong function
    const s = Utils.pingPong(Lerp.Easing.EASE_OUT(Utils.pingPong(time * 1.5))) * .3 + 0.8
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Utils.pingPong(time/5)/2)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {
    level.setSides(Utils.mathRandom(5, 6))
}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
