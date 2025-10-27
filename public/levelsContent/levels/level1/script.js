
import { Vector2, Color, Size } from '../../../utils/structures';
import Lerp from '../../../utils/interpolation';
import { level } from '../../../script';
import initPatterns from '../../patterns';
let g;
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
    g = level.game;
    // g.setBackgroundRadius(500);
    g.setSwapEnabled(true);
    g.setMainColor(new Color(255, 0, 0));
    g.setBackgroundTileColors([
        Color.hsvToRgb(0, 1, .2),
        Color.hsvToRgb(0, 1, .25)
    ])
    g.setRotationSpeed(0.1);
    g.setWallSpeedMult(3);
    g.setSides(5);
    g.set3dDepth(4);
    g.set3dDistance(50);
    g.setIncrementTime(10);
    g.setWallSpeedIncrement(1);
    g.setRotationSpeedIncrement(0.1);
    // g.set3dCoor(new Color(255, 255, 255));
    // g.set3dFalloffColor(new Color(0, 0, 0));
    g.setSkew(.05);
    // g.setPlayerSize(new Size(97, 100))
    // g.setPlayerDistanceMult(.1);

    patterns = initPatterns(g);
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
    g.setBackgroundTileColors([
        // Lerp.interpolate(Color.hsvToRgb(time * 0.2, 1, 0.5), Color.hsvToRgb(time * 0.2, 1, 0.1), (time/940-Math.floor(time/940))),
        // Lerp.interpolate(Color.hsvToRgb(time * 0.2, 1, 0.4), Color.hsvToRgb(time * 0.2, 1, 0.2), (time/940-Math.floor(time/940))),

        Color.hsvToRgb(time * 0.2, 1, .25),
        Color.hsvToRgb(time * 0.2, 1, .2),
        // Color.BLACK(255),
        // Color.WHITE(),
    ])
    // g.setOffset(new Vector2(Math.sin(time * 10) * 50, Math.cos(time) * 80));
    // g.setScale(g.getScale().sub(new Vector2(ft*.1, ft*.3)))
    // g.setRotation(g.getRotation() - ((time / .930 - Math.ceil(time / .930)) * 5 + 2))
    g.setMainColor(Color.hsvToRgb(time * 0.2, 1, 1))
    // g.setWallSpeedMult(g.getWallSpeedMult() + ft/10)
    // g.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
    g.setRadius(Math.sin(time*10)* 5 + 60);
}

level.onRender = ft => {
    time += ft;
    g.setSkew(Math.sin(time*10) * .1 + .1)
}
