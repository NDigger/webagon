import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level);

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 350, 100);
    else if (pKey === 1) await patterns.pRandomBarrage(Utils.mathRandom(4, 6), 170, 300);
    else if (pKey === 2) await patterns.pTunnel(Utils.mathRandom(4, 5), 250, 400, 1);
}

const pKeys = [0, 1, 2];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setRotationSpeed(0.3);
    level.setWallSpeedMult(5);
    level.setSides(3);
    level.set3dDepth(0);
    level.set3dDistance(50);
    level.setRadius(80);
    level.setRotationSpeedIncrement(.1);
    level.setIncrementTime(12);
    level.setSkew(.5);
    console.log(level.getTimestamp())
    level.setIncrementSpinPower(.4);
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
            new Color(0, 155, 0),
        ])
    level.setMainColor(new Color(0, 255, 0));

    const s = Lerp.CapMode.pingPong(time * 2) * .5 + 1.5;
    level.setWallScale(new Vector2(s, s));
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
