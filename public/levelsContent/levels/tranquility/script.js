
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

const wallExLR = async (times, delay, delayEnd) => {
    const side = Utils.getRandomSide(level);
    for (let i = 0; i < times; i++) {
        const inc = i*2 + side;
        patterns.wallEx(inc)
        if (times !== i -1) await level.distanceDelay(delay)
    }
    await level.distanceDelay(delayEnd);
}

const tunnelSpecial = async(delay, delayEnd) => {
    const thickness = delay * 3 + 40;
    level.createWall(0, thickness);
    level.createWall(-1, thickness - delay);
    level.createWall(-2, thickness - delay * 2);
    level.createWall(-3, thickness - delay * 3);
    level.createWall(1, thickness - delay);
    level.createWall(2, thickness - delay * 2);
    level.createWall(3, thickness - delay * 3);
    await level.distanceDelay(delay * 3);
    await patterns.pAltBarrage(2, delay * 3, delay);
    level.createWall(4, thickness)
    await level.distanceDelay(delay);
    level.createWall(3, thickness - delay)
    level.createWall(5, thickness - delay)
    await level.distanceDelay(delay);
    level.createWall(2, thickness - delay * 2)
    level.createWall(6, thickness - delay * 2)
    await level.distanceDelay(delay);
    level.createWall(1, thickness - delay * 3)
    level.createWall(7, thickness - delay * 3)

    await level.distanceDelay(delayEnd);
}

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    const wallSpeed = level.getWallSpeedMult() * level.getDifficultyMult();
    const d = 500 * Math.max(1, wallSpeed / 7);
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(3, 4), d, d);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), d * .5, d);
    else if (pKey === 2) await patterns.pDoubleSpiral(Utils.mathRandom(7, 9), d * .25, d, 2);
    else if (pKey === 3) await patterns.pTunnel(Utils.mathRandom(2, 3), d * 1.2, d);
    else if (pKey === 4) await patterns.pAltBarrage(Utils.mathRandom(3, 4), d * .6, d);
    else if (pKey === 5) await patterns.pWallExSpam(3, 80, d);
    else if (pKey === 6) await wallExLR(4, d * .7, d);
    else if (pKey === 7) await patterns.pBarrageSpam(3, 80, d);
    // else if (pKey === 7) await tunnelSpecial(d * .2, d);
}

const enableSwapOnHighSpeed = () => {
    const wasSwapEnabled = level.getSwapEnabled();
    level.getWallSpeedMult() * level.getDifficultyMult() > 4.2 && level.setSwapEnabled(true);
    if (wasSwapEnabled !== level.getSwapEnabled())
        level.showMessage('Speedmult > 4.2\nSwap enabled!', 2)
}


const pKeys = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 6, 7];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setMainColor(new Color(255, 0, 0));
    level.setBackgroundTileColors([
        Color.hsvToRgb(0, .0, 1),
        Color.hsvToRgb(0, .05, 1),
    ])
    level.setRadius(80);
    level.setRotationSpeed(0.04);
    level.setWallSpeedMult(2);
    level.setSides(8);
    level.set3dLayersCount(3);
    level.set3dDistance(500);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.015);
    enableSwapOnHighSpeed();
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await level.distanceDelay(0);
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
    const mainColor = level.getMainColor();
    level.set3dColor(new Color(255, 255, 255))
    level.set3dFalloffColor(new Color(mainColor.r, mainColor.g, mainColor.b, 0));

    // Imitating level pulse with pingPong function
    const s = Utils.pingPong(time * 2.2) * .1 + 1
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Utils.pingPong(time/10)/2)
    level.set3dDepthMult(level.getSkew());
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {
    enableSwapOnHighSpeed();
}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
