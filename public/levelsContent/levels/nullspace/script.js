
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pRandomBarrage(Utils.mathRandom(9, 14), 250, 400);
    else if (pKey === 1) await patterns.pAltBarrage(Utils.mathRandom(9, 11), 300, 400);
}

const pKeys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setBackgroundTileColors([
        new Color(255, 255, 255),
        new Color(250, 250, 250),
    ])

    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(50);
    level.setRotationSpeed(0.04);
    level.setWallSpeedMult(3.2);
    level.setSides(6);
    level.set3dLayersCount(6);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.04);
    level.setMainColor(new Color(0, 0, 0, 0));
    level.set3dColor(new Color(0, 0, 0, 0));
    level.set3dFalloffColor(new Color(0, 0, 0, 155));
    level.setOffset(new Vector2(10, 0));
    level.setPolygonColor(new Color(0, 0, 0, 0))
    level.setBackgroundSwapTime(9999999);
    level.setScale(new Vector2(.5, .5))
    level.set3dFalloffScale(new Vector2(4, 4));
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
    const t = level.getTime();

    level.setBackgroundRotationOffset(-level.getRotation())
    level.set3dDistance(Math.sin(t) * 100);
    level.setRadius(Math.sin(t * 20) * 2 + 45)
    level.setWallScale(new Vector2(Math.sin(t * 20) * .04 + 1, Math.cos(t * 20) * .04 + 1))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()*.1)*.5)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
