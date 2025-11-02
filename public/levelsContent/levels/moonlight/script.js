
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pAltBarrage(Utils.mathRandom(3, 5), 150, 200);
    else if (pKey === 1) await patterns.pWallExVortex(Utils.mathRandom(2, 4), 150, 200);
    else if (pKey === 2) await patterns.pAltTunnel(Utils.mathRandom(4, 5), 150, 200);
    else if (pKey === 3) await patterns.pWallExSpiral(Utils.mathRandom(4, 5), 150, 200);
    else if (pKey === 4) await patterns.pInverseBarrage(Utils.mathRandom(4, 5), 350, 200);
    else if (pKey === 5) await patterns.pSpiralBarrage(Utils.mathRandom(4, 5), 150, 200);
    else if (pKey === 6) await patterns.pSpiral(Utils.mathRandom(4, 5), 150, 200, 7);
}

const pKeys = [0, 1, 2, 3, 4, 5, 6];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    // g.setBackgroundRadius(500);
    level.setSwapEnabled(true);
    level.setRadius(140);
    level.setRotationSpeed(0.08);
    level.setWallSpeedMult(3);
    level.setSides(9);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.03);
    level.setIncrementTime(12);
    level.setScale(new Vector2(1.3, 1.3))
    level.setSkew(.9);
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
    const colorTime = time / 4;
    level.setBackgroundTileColors([
        Lerp.interpolate(Color.hsvToRgb(.7, 1., .3), new Color(55, 25, 25), Lerp.CapMode.pingPong(time * .2)),
        Lerp.interpolate(Color.hsvToRgb(.7, 1., .4), new Color(45, 15, 15), Lerp.CapMode.pingPong(time * .2)),
    ])

    level.setMainColor(Lerp.interpolate(Color.BLUE(), new Color(215, 155, 155), Lerp.CapMode.pingPong(time * .2)))
    level.setPolygonColor(level.getMainColor())
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
