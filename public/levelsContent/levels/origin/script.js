
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';

let patterns = initPatterns(level);

const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 500, 700);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), 300, 600);
    else if (pKey === 2) await patterns.pSpiral(Utils.mathRandom(7, 9), 100, 400, 1);
    else if (pKey === 3) await patterns.pTunnel(Utils.mathRandom(2, 3), 700, 600);
}

const pKeys = [0, 1, 2, 3];
let activeKeys = [];

level.onInit = () => {
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(70);
    level.setRotationSpeed(0.035);
    level.setWallSpeedMult(2.4);
    level.setSides(5);
    level.set3dLayersCount(8);
    level.set3dDistance(5);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.015);
}

// onStep must be async and use delays in order to work. No delays may cause crash.
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
        new Color(75, 75, 75),
        new Color(85, 85, 85),
    ])
    const t = level.getTime();
    level.setMainColor(Color.hsvToRgb(t * 0.2, 1, 1))
    level.setScale(new Vector2(
        Utils.pingPong(t * .5) * .2 + 1, 
        Utils.pingPong(t * .5) * .2 + 1)
    )
}

level.onIncrement = () => {
    level.setSides(Utils.mathRandom(5, 6))
}

level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()*.07)*.5)
}
