
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

const pSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
    const side = Utils.getRandomSide(level);
    const dir = Utils.getRandomDir();
    for(let i = 0; i < times; i++) {
        for(let k = 0; k < extra; k++) level.createWall((i+k) * dir + side, 40)
        await level.distanceDelay(delay);
    }
    await level.distanceDelay(delayEnd);
}

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    const d = 420 * Math.max(level.getWallSpeedMult()/8, 1);
    const de = d * 1.4;
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), d * 1.3, de);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(3, 4), d * .8, de);
    else if (pKey === 2) await patterns.pTunnel(Utils.mathRandom(5, 7), d * 1.85, de, Utils.mathRandom(1, 2));
    else if (pKey === 3) await patterns.pRandomBarrage(Utils.mathRandom(5, 6), d * .82, de);
    else if (pKey === 4) await patterns.pSpiral(Utils.mathRandom(3, 4), d * .5, de, 1);
    else if (pKey === 5) await patterns.pAltBarrage(Utils.mathRandom(3, 4), d * 0.8, de);
    else if (pKey === 6) await patterns.pAltSpam(3, 80, de);
}

const pKeys = [0, 1, 2, 3, 3, 4, 5, 6];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setBackgroundTileColors([new Color(0, 0, 0)])
    level.setRadius(70);
    level.setWallSpeedMult(5);
    level.setRotation(-90);
    level.setSides(5);
    level.set3dLayersCount(5);
    level.set3dDistance(5);
    level.setIncrementTime(11.5);
    level.setWallSpeedIncrement(.35);
    level.setWallSpeedMax(6.4);
    level.set3dFalloffColor(new Color(0, 0, 0, 0));
    level.set3dDepthMult(0);
    level.set3dFalloffScale(new Vector2(.5, .5))
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

let prevFract = 0; 
// onUpdate is called every frame.
level.onUpdate = ft => {
    const t = level.getTime()
    const syncTime = t * 1.9;
    const fract = Utils.fract(syncTime);
    if (prevFract > fract) rotationDir = Math.random() > .5 ? 1 : -1;
    prevFract = fract;

    level.setBackgroundRotationOffset(2*-level.getRotation());
    level.setRadius(70 - fract * 10)

    level.setWallAngleLeft(fract * .5);
    level.setWallAngleRight(-fract * .5);

    const rs = rotationSpeed;
    level.setRotationSpeed((rs - fract * rs + rs * .3) * rotationDir)

    const mainColor = level.getMainColor();
    level.set3dColor(new Color(mainColor.r, mainColor.g, mainColor.b, 75));
    level.setMainColor(Utils.interpolate(new Color(255, 155, 255), new Color(0, 255, 255), Utils.pingPong(t * 10)))

    // Imitating level pulse with pingPong function
    const s = 1 - Utils.pingPong(fract) * .4
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime() * 2) * .2)
}

let rotationSpeed = .3;
let rotationDir = 1;
// onPreIncrement is called immediately when inтcrement time is achieved
level.onPreIncrement = () => {
    rotationDir = -rotationDir
    rotationSpeed += .035;
}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
