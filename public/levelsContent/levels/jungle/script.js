import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level);

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pRandomBarrage(Utils.mathRandom(6, 9), 250, 400);
    else if (pKey === 1) await patterns.pTunnel(Utils.mathRandom(3, 4), 350, 400, 1);
    else if (pKey === 2) await patterns.pSpiral(Utils.mathRandom(4, 5), 350, 400, 1);
}

const pKeys = [0, 0, 0, 0, 0, 1, 2];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setRotationSpeed(0.2);
    level.setWallSpeedMult(6);
    level.setSides(3);
    level.set3dDepth(7);
    level.set3dDistance(4);
    level.setRadius(80);
    level.setWallSpeedIncrement(.25);
    level.setRotationSpeedIncrement(.05);
    level.setIncrementTime(12);
    level.setSkew(.5);
    console.log(level.getTimestamp())
    level.setIncrementSpinPower(.4);
    level.set3dFalloffColor(new Color(0, 0, 0, 0))
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
            Color.hsvToRgb(.4 - Utils.pingPong(time * 10) * .2, 1, .5  - Utils.pingPong(time * 2) * .4),
            Color.hsvToRgb(.4 - Utils.pingPong(time * 10) * .2, 1, .4 - Utils.pingPong(time * 2) * .2),
        ])
    level.setMainColor(Color.hsvToRgb(.4 - Utils.pingPong(time * 10) * .2, 1, 1))

    const s = Utils.pingPong(time * 2) * 1 + 1.5;
    level.setWallScale(new Vector2(s, s));
    level.setRadius(100 - Utils.fract(time * 2.4) * 20);
    level.setBackgroundRadius(1000 + Utils.pingPong(time * 1.8) * 1500);
}

level.onRender = ft => {
    time += ft;
    level.setSkew(Math.sin(time*10) * .5 + 1.5)
}

// onStep must be async and use delays in order to work. No delays may cause crash.
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}


// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
