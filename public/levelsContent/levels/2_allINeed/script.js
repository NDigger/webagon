import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level);

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 350, 150);
    else if (pKey === 1) await patterns.pRandomBarrage(Utils.mathRandom(4, 6), 200, 250);
    else if (pKey === 2) await patterns.pAltBarrage(Utils.mathRandom(4, 5), 250, 250, 1);
    else if (pKey === 3) await patterns.pDoubleSpiral(Utils.mathRandom(5, 9), 100, 250);
    else if (pKey === 3) await patterns.pAltTunnel(Utils.mathRandom(2, 3), 200, 250);
}

const pKeys = [0, 1, 2, 3];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    // level.setSwapEnabled(true);
    level.setRotationSpeed(0.3);
    level.setWallSpeedMult(3.5);
    level.setSides(6);
    level.set3dDepth(6);
    level.set3dDistance(5);
    level.setRadius(80);
    level.setWallSpeedIncrement(.1);
    level.setRotationSpeedIncrement(.04);
    level.setSkew(.2);
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
            new Color(240, 250, 255)
        ])
    level.setBackgroundRotationOffset(time * 360 * level.getRotationSpeed());
    level.setMainColor(new Color(175 - Lerp.CapMode.pingPong(time) * 50, 215, 255))

    const s = Lerp.CapMode.pingPong(1-Lerp.Easing.EASE_OUT(Lerp.CapMode.fract(time * 1.05))) * .9 + 1;
    level.setWallScale(new Vector2(s, s));
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Math.sin(time*10) * .1 + .1)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
