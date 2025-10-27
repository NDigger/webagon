
import { Vector2, Color, Size } from '../../../utils/structures';
import Lerp from '../../../utils/interpolation';
import { level } from '../../../script';
import initPatterns from '../../patterns';
let patterns

const delay = s => new Promise(resolve => setTimeout(resolve, s*1000));

const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(2, 300, 0);
    else if (pKey === 1) await patterns.pSpiralBarrage(4, 250, 0);
    // else if (pKey === 2) await patterns.pSpiral(5, 40, 200, 1);
    // else if (pKey === 3) await patterns.pDoubleSpiral(5, 80, 200);
    else if (pKey === 4) await patterns.pLeftRight(5, 200, 0);
    else if (pKey === 5) await patterns.pWallExVortex(3, 200, 0);
    else if (pKey === 6) await patterns.pTunnel(3, 400, 250);
    else if (pKey === 7) await patterns.pAltTunnel(3, 200, 250, 3);
    else if (pKey === 8) await patterns.pLRBarrage(4, 200, 0); 
    else if (pKey === 9) await patterns.pWallExSpiral(4, 200, 0);
    else if (pKey === 10) await patterns.pWallExSpam(3, 80, 120);
    else if (pKey === 11) await patterns.pWallExTunnel(3, 200, 200)
    else if (pKey === 12) await patterns.pRandomLRBarrage(10, 200, 0);
    else if (pKey === 13) await patterns.pBarrageSpam(3, 60, 300);
}

const pKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let activeKeys = [];

level.onInit = () => {
    // g.setBackgroundRadius(500);
    level.setSwapEnabled(true);
    level.setMainColor(new Color(255, 0, 0));
    level.setBackgroundTileColors([
        Color.hsvToRgb(0, 1, .2),
        Color.hsvToRgb(0, 1, .25)
    ])
    level.setRotationSpeed(0.1);
    level.setWallSpeedMult(3);
    level.setSides(5);
    level.set3dDepth(4);
    level.set3dDistance(50);
    level.setIncrementTime(10);
    level.setWallSpeedIncrement(1);
    level.setRotationSpeedIncrement(0.1);
    // level.set3dCoor(new Color(255, 255, 255));
    // level.set3dFalloffColor(new Color(0, 0, 0));
    level.setSkew(.05);
    // level.setPlayerSize(new Size(97, 100))
    // level.setPlayerDistanceMult(.1);

    patterns = initPatterns(level);
}

// onStep must be async and use delays in order to work. No delays may cause crash.
level.onStep = async () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    await addPattern(activeKeys.splice(rndIndex, 1)[0])
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
        // Lerp.interpolate(Color.hsvToRgb(time * 0.2, 1, 0.5), Color.hsvToRgb(time * 0.2, 1, 0.1), (time/940-Math.floor(time/940))),
        // Lerp.interpolate(Color.hsvToRgb(time * 0.2, 1, 0.4), Color.hsvToRgb(time * 0.2, 1, 0.2), (time/940-Math.floor(time/940))),

        Color.hsvToRgb(time * 0.2, 1, .25),
        Color.hsvToRgb(time * 0.2, 1, .2),
        // Color.BLACK(255),
        // Color.WHITE(),
    ])
    // level.setOffset(new Vector2(Math.sin(time * 10) * 50, Math.cos(time) * 80));
    // level.setScale(level.getScale().sub(new Vector2(ft*.1, ft*.3)))
    // level.setRotation(level.getRotation() - ((time / .930 - Math.ceil(time / .930)) * 5 + 2))
    level.setMainColor(Color.hsvToRgb(time * 0.2, 1, 1))
    // level.setWallSpeedMult(level.getWallSpeedMult() + ft/10)
    // level.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
    level.setRadius(Math.sin(time*10)* 5 + 60);
}

level.onRender = ft => {
    time += ft;
    level.setSkew(Math.sin(time*10) * .1 + .1)
}
