
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

const pSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
    const side = Utils.getRandomSide();
    const dir = Utils.getRandomDir();
    for(let i = 0; i < times; i++) {
        for(let k = 0; k < extra; k++) level.createWall((i+k) * dir + side, 40)
        await level.distanceDelay(delay);
    }
    await level.distanceDelay(delayEnd);
}

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 400, 400);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(3, 4), 250, 400);
    else if (pKey === 2) await pSpiral(Utils.mathRandom(5, 7), 150, 400, 2);
    else if (pKey === 3) await patterns.pRandomBarrage(Utils.mathRandom(5, 6), 200, 400);
    else if (pKey === 4) await patterns.pTunnel(Utils.mathRandom(2, 3), 400, 400);
}

const pKeys = [0, 1, 2, 3, 3, 3, 4];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(70);
    level.setRotationSpeed(0.15);
    level.setWallSpeedMult(4);
    level.setSides(4);
    level.set3dDepth(8);
    level.set3dDistance(16);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.015);
    level.set3dFalloffColor(new Color(0, 0, 0, 0));
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
    const t = level.getTime()
    level.setBackgroundTileColors([
        Utils.interpolate(new Color(0, 0, 25), new Color(0, 0, 0), Utils.pingPong(t*10)),
    ])
    const syncTime = t * 1.9;

    level.setRadius(90 - Utils.fract(syncTime) * 20)
    level.setWallSkewLeft(-Utils.fract(syncTime) * 40)
    level.setWallSkewRight(-Utils.fract(syncTime) * 40)

    level.setMainColor(Utils.interpolate(new Color(255, 0, 0), new Color(0, 255, 255), Utils.pingPong(t * 10)))

    // Imitating level pulse with pingPong function
    const s = Utils.fract(Utils.easeOut(Utils.fract(syncTime))) * .8 + 1.5
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()*2)*.1+.8)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
