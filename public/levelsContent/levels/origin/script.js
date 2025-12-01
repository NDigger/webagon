
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';

let patterns = initPatterns(level);

const addPattern = async pKey => {
    const diff = level.getDifficultyMult();
    const speed = level.getWallSpeedMult();
    const wallSpeed = speed * diff;
    const d = 500 * Math.max(1, wallSpeed / 8);
    const spiralD = d * speed * diff * .07;
    
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), d, d * 1.4);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), d * .5, d);
    else if (pKey === 2) await patterns.pSpiral(Utils.mathRandom(7, 9), spiralD, d * .8, 1);
    else if (pKey === 3) await patterns.pTunnel(Utils.mathRandom(2, 3), d * 1.4, d * 1.2);
}

const pKeys = [0, 1, 2, 3];
let activeKeys = [];

const enableSwapOnHighSpeed = () => {
    const wasSwapEnabled = level.getSwapEnabled();
    level.getWallSpeedMult() * level.getDifficultyMult() > 5.8 && level.setSwapEnabled(true);
    if (wasSwapEnabled !== level.getSwapEnabled())
        level.showMessage('Speedmult > 5.8\nSwap enabled!', 120)
}

level.onInit = () => {
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(70);
    level.setRotationSpeed(0.035);
    level.setWallSpeedMult(2.4);
    level.setSides(level.getDifficultyMult() > 2 ? 6 : 5);
    level.set3dLayersCount(8);
    level.set3dDistance(5);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.015);
    level.setSkew(0);
    level.setPlayerSwapReloadTime(.3);
    enableSwapOnHighSpeed();
}

// onStep must be async and use delays in order to work. No delays may cause crash.
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
    await level.distanceDelay(0);
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
    enableSwapOnHighSpeed();
    if (level.getDifficultyMult() > 2) return
    level.setSides(Utils.mathRandom(5, 6))
}

level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime()*.07)*.5)
}
