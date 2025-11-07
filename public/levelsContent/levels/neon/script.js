
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

const getRandomSide = () => Math.floor(Math.random() * level.getSides());    
const getRandomDir = () => Math.random() < .5 ? -1 : 1;

const pSpiral = async (times, delay, delayEnd = 0, extra = 1) => {
    const side = getRandomSide();
    const dir = getRandomDir();
    for(let i = 0; i < times; i++) {
        for(let k = 0; k < extra; k++) level.createWall((i+k) * dir + side, delay)
        for(let k = 0; k < extra; k++) level.createWall((-i-k) * dir + side, delay)
        await level.distanceDelay(delay);
    }
    await level.distanceDelay(delayEnd);
}

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(4, 200, 300);
    else if (pKey === 1) await pSpiral(4, 60, 200);
    else if (pKey === 2) await patterns.pTunnel(3, 260, 300);
    else if (pKey === 3) await patterns.pRandomBarrage(5, 200, 300);
}

const pKeys = [0, 1, 2, 3, 4];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    // g.setBackgroundRadius(500);
    level.setSwapEnabled(true);
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(70);
    level.setRotationSpeed(0.1);
    level.setWallSpeedMult(4);
    level.setSides(6);
    level.set3dDepth(4);
    level.set3dDistance(50);
    level.setWallSpeedIncrement(0.2);
    level.setIncrementTime(12);
    
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

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, .24),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, .20),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, .15),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, .10),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, .15),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, .20),
    ])
    const f = Utils.fract(level.getTime() * 2.5 + .2)

    level.setRadius(85 - f * 15);

    level.setMainColor(Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 - .1, 1, 1))

    const s = 1.2 - f * .1
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
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
