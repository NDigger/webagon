
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
const patterns = initPatterns(level); // Patterns require level object in order to be spawned.
const getRandomSide = () => Math.floor(Math.random() * level.getSides());    
const getRandomDir = () => Math.random() < .5 ? -1 : 1;
const barrage = patterns.barrage;

const extraThickness = 15;

const pSwapper = async (delay, delayEnd, side = getRandomSide()) => {
    barrage(side);
    level.createWall(side - 2, delay + 40 + extraThickness);
    level.createWall(side, delay + 40 + extraThickness);
    await level.distanceDelay(delay);
    level.createWall(side - 1, 40);
    await level.distanceDelay(delayEnd);
}

const pSwapperInverse = async (delay, delayEnd) => {
    const side = getRandomSide();
    level.createWall(side - 1, 40);
    level.createWall(side - 2, delay + 40 + extraThickness);
    level.createWall(side, delay + 40 + extraThickness);
    await level.distanceDelay(delay);
    barrage(side);
    await level.distanceDelay(delayEnd);
}

const pSwappers = async (times, delay, delayEnd) => {
    let side = getRandomSide();
    for (let i = 0; i < times; i++) {
        await pSwapper(delay, 0, side)
        side += Utils.mathRandom(2, level.getSides() - 2);
    }
    await level.distanceDelay(delayEnd)
}

const pSwapTunnel = async (times, delay, delayEnd) => {
    const side = getRandomSide()
    for (let i = 0; i < times; i++) {
        let bSide = getRandomSide();
        if (bSide === (side % 6) || bSide === (side + Math.floor(level.getSides()/2)) % 6) {
            bSide += Math.random() > .5 ? 1 : -1;
        }
        barrage(bSide + 1)
        if (i !== times - 1) {
            level.createWall(side, delay + extraThickness);
            level.createWall(side + Math.floor(level.getSides()/2), delay + extraThickness);
            await level.distanceDelay(delay)
        }
    }
    await level.distanceDelay(delayEnd)
}

const pSwapSpiral = async (times, delay, delayEnd) => {
    let side = getRandomSide();
    let dir = getRandomDir();
    for (let i = 0; i < times; i++) {
        barrage(side+=dir);
        await level.distanceDelay(delay)
    }
    barrage(side+=(Math.floor(level.getSides()/2)));
    dir = getRandomDir();
    await level.distanceDelay(delay)
    for (let i = 0; i < times; i++) {
        barrage(side+=dir);
        if (i !== times - 1) await level.distanceDelay(delay);
    }
    await level.distanceDelay(delayEnd);
}

const pSwapTunnel2 = async (times, delay, delayEnd) => {
    const side = getRandomSide();
    for (let i = 0; i < times; i++) {
        for(let k = 1; k <= level.getSides()/2 - 1; k++) level.createWall(side + k, delay + extraThickness);
        for(let k = level.getSides()/2 + 1; k <= level.getSides() - 1; k++) level.createWall(side + k, delay + extraThickness);
        barrage(side + 1 + (Math.random() > .5 ? level.getSides() / 2 : 0));
        await level.distanceDelay(delay);
    }
    barrage(side + 1 + (Math.random() > .5 ? level.getSides() / 2 : 0));
    await level.distanceDelay(delayEnd);
}

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await pSwapper(250, 320);
    else if (pKey === 1) await pSwappers(Utils.mathRandom(3, 4), 320, 320);
    else if (pKey === 2) await pSwapTunnel(Utils.mathRandom(3, 4), 320, 320);
    else if (pKey === 3) await patterns.pInverseBarrage(Utils.mathRandom(4, 6), 240, 320);
    else if (pKey === 4) await pSwapSpiral(Utils.mathRandom(3, 4), 200, 320);
    else if (pKey === 5) await pSwapTunnel2(Utils.mathRandom(2, 3), 250, 320);
    else if (pKey === 6) await pSwapperInverse(250, 320);
}

const pKeys = [0, 1, 2, 3, 4, 5, 6];
// const pKeys = [6];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setSwapEnabled(true);
    level.setWallSpeedMult(3);
    level.setSides(6);
    level.set3dDepth(5);
    level.set3dDistance(8);
    level.setWallSpeedIncrement(0.2);
    level.setIncrementTime(12);
    level.set3dColor(new Color(0, 0, 0));
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

let time = 0;

const getValue = shift => Math.sin(level.getTime() * 10 + shift) * .1 + .1
// onUpdate is called every frame.
level.onUpdate = ft => {
    const hueShift = Utils.fract(.5 + level.getTime() / 200)
    const t = level.getTime();
    level.setBackgroundTileColors([
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 + hueShift, 1, getValue(1/Math.PI*2)),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 + hueShift, 1, getValue(2/Math.PI*2)),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 + hueShift, 1, getValue(3/Math.PI*2)),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 + hueShift, 1, getValue(4/Math.PI*2)),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 + hueShift, 1, getValue(3/Math.PI*2)),
        Color.hsvToRgb(Utils.pingPong(level.getTime() * 5.) * .1 + hueShift, 1, getValue(2/Math.PI*2)),
    ])
    const syncTime = level.getTime() * 2.5 + .2;
    const f = Utils.fract(syncTime)

    level.setRotationSpeed(((rotationSpeed/2)-Utils.fract(syncTime * .5) * rotationSpeed) * rotationDir);

    level.setRadius(85 - f * 15);
    level.setRotationSpeed()

    level.setMainColor(Lerp.interpolate(Color.hsvToRgb(Utils.pingPong(syncTime) * .1 + hueShift, 1, 1), Color.hsvToRgb(Utils.pingPong(syncTime) * .1 + hueShift, .2, 1), Utils.pingPong(time * 10)))

    const s = 1.2 + Utils.pingPong(syncTime) * .5
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Utils.pingPong(time) * .3 + .5)
}

let rotationDir = 1;
let rotationSpeed = .35;
// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {
    rotationDir *= -1;
    rotationSpeed += .06;
}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
