import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level);

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pTunnel(Utils.mathRandom(3, 4), 450, 400);
    else if (pKey === 1) await patterns.pDoubleSpiral(Utils.mathRandom(4, 5), 200, 200, 1)
    else if (pKey === 2) await patterns.pInverseBarrage(4, 350, 200)
    else if (pKey === 3) await patterns.pWallExVortex(Utils.mathRandom(4, 5), 200, 200);
    else if (pKey === 4) await patterns.pSpiralBarrage(Utils.mathRandom(4, 5), 200, 200);
    else if (pKey === 5) await patterns.pAltBarrage(Utils.mathRandom(4, 5), 200, 200);
    else if (pKey === 6) await patterns.pAltSpam(3, 50, 200, 1);
    else if (pKey === 7) await patterns.pWallExSpam(3, 50, 200, 1);
}

const pKeys = [0, 1, 2, 3, 4, 5, 6, 7];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setWallSpeedMult(2.6);
    level.setWallSpawnDistance(1500);
    level.setSides(6);
    level.setMainColor(Color.WHITE());
    level.setSkew(0);
    level.set3dFalloffColor(new Color(0, 0, 0, 0));
    level.setScale(new Vector2(1.3, 1.3))
    level.setIncrementTime(15);
    level.setWallSpeedIncrement(.2);
    level.setBackgroundSwapTime(.1);
    level.setPlayerSize(new Size(18, 10))

    level.setBackgroundTileColors([
        new Color(0, 0, 0),
        new Color(10, 10, 10)
    ]);
    level.setMainColor(Color.WHITE())
}

let time = 0;
let rotationTime = 0;
const rotationLerp = new Lerp(v => level.setRotation(v))
// onUpdate is called every frame.
level.onUpdate = ft => {
    rotationTime -= ft;
    if (rotationTime < 0) {
        rotationTime = Math.random() * 2 + 1
        rotationLerp.run(Utils.mathRandom(0, 5) * 60 + 30, 1.3, Lerp.Easing.EASE_IN_OUT)
    }
    level.setRadius(60 + Math.sin(time * 3) * 3)
}

level.onRender = ft => {
    time += ft;
    // level.setSkew(Math.sin(time*10) * .1 + .1)
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