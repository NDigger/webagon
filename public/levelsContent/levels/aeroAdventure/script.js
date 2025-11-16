
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    const d = Math.max(level.getWallSpeedMult(), 5) * (50 - level.getWallSpeedMult());
    if (pKey === 0) await patterns.pRandomBarrage(Utils.mathRandom(3, 4), d, d * 1.5);
    else if (pKey === 1) await patterns.pAltBarrage(Utils.mathRandom(3, 4), d, d * 1.5);
    else if (pKey === 2) await patterns.pTunnel(Utils.mathRandom(4, 5), d * 2, d * 1.5);
    else if (pKey === 3) await patterns.pLRBarrage(Utils.mathRandom(4, 5), d, d * 1.5);
    else if (pKey === 4) await patterns.pLeftRight(Utils.mathRandom(4, 5), d, d * 1.5);
    else if (pKey === 5) await patterns.pSpiralBarrage(Utils.mathRandom(4, 5), d, d * 1.5);
}

const pKeys = [0, 1, 2, 3, 4, 5];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setBackgroundTileColors([
        new Color(175, 205, 225),
        new Color(170, 200, 230),
        new Color(175, 195, 230),
        new Color(170, 190, 230),
        new Color(175, 195, 230),
    ])

    level.setWallSpawnDistance(2000);
    level.setMainColor(new Color(255, 255, 255));
    level.setRadius(70);
    level.setRotationSpeed(0.15);
    level.setWallSpeedMult(5);
    level.setSides(5);
    level.set3dLayersCount(4);
    level.setIncrementTime(12);
    level.setWallSpeedIncrement(0.3);
    level.setRotationSpeedIncrement(0.04);
    level.set3dColor(new Color(255, 155, 155, 55));
    level.set3dFalloffColor(new Color(255, 255, 255, 0));
    // level.setPolygonColor(level.getMainColor())
    level.setBackgroundSwapTime(9999999);
    level.setScale(new Vector2(1, 1))
    level.setBackgroundDarkenUnevenChunkEnabled(false);
    level.set3dDistance(50);
    
    level.set3dDepthMult(level.getWallSpeedMult() / 10);
}

// onStep must be async and use delays in order to work. No delays may cause crash.
// Insert your wall spawn logic here
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await level.distanceDelay(0);
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

// onUpdate is called every frame.
level.onUpdate = ft => {
    const p = Utils.pingPong(level.getTime() * 2.5) * 20;
    level.setBackgroundTileColors([
        new Color(55, 5, 235 + p),
        new Color(50, 0, 225 + p),
        new Color(55, 15, 215 + p),
        new Color(50, 10, 205 + p),
        new Color(55, 15, 215 + p),
    ])

    const t = level.getTime();
    const sync = 1.-Utils.fract(level.getTime() * 2.5);

    level.setRadius(70 + sync*10);

    const s = Utils.pingPong(level.getTime() * 2.5) * .5 - 1
    level.set3dFalloffScale(new Vector2(s, s));
    const wallScale = new Vector2(Math.sin(t * 20) * .04 + 1, Math.cos(t * 20) * .04 + 1);
    level.setWallScale(wallScale.mul(new Vector2(1 + sync * .2, 1 + sync * .2)))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()) * .5 + .5)
    // level.set3dDepthMult(Utils.pingPong(level.getTime()) * .3 + .3)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {
    level.set3dDepthMult(level.getWallSpeedMult() / 10);
}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
