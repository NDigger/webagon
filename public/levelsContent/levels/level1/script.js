
import { Vector2, Color, Size } from '../../../utils/structures';
import Lerp from '../../../utils/interpolation';
import { level } from '../../../script';
let g;

const delay = s => new Promise(resolve => setTimeout(resolve, s*1000));

const getRandomSide = () => Math.floor(Math.random() * g.getSides());
const getRandomDir = () => Math.random() < .5 ? -1 : 1;

const barrage = side => {
    for(let i = 0; i < g.getSides() - 1; i++) {
        g.createWall(i + side, 40)
    }
}

const alt = side => {
    for(let i = 0; i < g.getSides(); i+=2) {
        g.createWall(i + side, 40);
    }
}

const wallEx = side => {
    for(let i = 0; i < g.getSides(); i+=2) {
        g.createWall(i + side, 40);
    }
}

const pInverseBarrage = async (times, delay, delayEnd) => {
    const side = getRandomSide();
    for(let i = 0; i < times; i++) {
        barrage((i%2)*g.getSides()/2+side);
        await g.distanceDelay(delay);
    }
    await g.distanceDelay(delayEnd);
}

const pSpiral = async (times, delay, delayEnd, extra = 1) => {
    const side = getRandomSide();
    const dir = getRandomDir();
    for(let i = 0; i < times; i++) {
        for(let k = 0; k < extra; k++) g.createWall((i+k) * dir + side, delay)
        await g.distanceDelay(delay);
    }
    await g.distanceDelay(delayEnd);
}

const pDoubleSpiral = async (times, delay, delayEnd, extra = 1) => {
    const side = getRandomSide();
    const dir = getRandomDir();
    for(let i = 0; i < times; i++) {
        for(let k = 0; k < extra; k++) {
            g.createWall((i+k) * dir + side, delay);
            g.createWall((i+k+g.getSides()/2) * dir + side, delay);
        }
        await g.distanceDelay(delay);
    }
    await g.distanceDelay(delayEnd);
}

const pSpiralBarrage = async (times, delay, delayEnd) => {
    const side = getRandomSide();
    const dir = getRandomDir();
    for(let i = 0; i < times; i++) {
        barrage(i * dir + side);
        await g.distanceDelay(delay);
    }
    await g.distanceDelay(delayEnd);
}

const pLeftRight = async (times, delay, delayEnd) => {
    const side = getRandomSide();
    for(let i = 0; i < times; i++) {
        if (i % 2 === 0) {
            barrage(side);
        } else {
            g.createWall(side - 1, 40)
        }
        await g.distanceDelay(delay);
    }
    await g.distanceDelay(delayEnd);
}

const addPattern = async pKey => {
    // if (pKey === 0) await pInverseBarrage(2, 300, 100);
    // else if (pKey === 1) await pSpiralBarrage(4, 250, 100);
    // else if (pKey === 2) await pSpiral(5, 40, 220, 1);
    // else if (pKey === 3) await pDoubleSpiral(5, 80, 220);
    if (pKey === 4) await pLeftRight(5, 200, 100);
    step()
}

const pKeys = [0, 1, 2, 3, 4];
let activeKeys = [];

const step = () => {
    if (activeKeys.length === 0) activeKeys = pKeys.slice();
    const rndIndex = Math.floor(Math.random() * activeKeys.length)
    const deletedIndex = activeKeys.splice(rndIndex, 1)[0]
    console.log(deletedIndex)
    addPattern(deletedIndex)
}

(async () => requestAnimationFrame(() => step()))()

level.onInit = () => {
    g = level.game;
    g.setBackgroundRadius(500);
    g.setSwapEnabled(true);
    g.setMainColor(new Color(255, 0, 0));
    g.setBackgroundTileColors([
        Color.hsvToRgb(0, 1, .2),
        Color.hsvToRgb(0, 1, .25)
    ])
    g.setRotationSpeed(0.1);
    g.setWallSpeedMult(3);
    g.setSides(6);
    g.set3dDepth(5);
    g.set3dDistance(20);
    // g.set3dColor(new Color(255, 255, 255));
    // g.set3dFalloffColor(new Color(0, 0, 0));
    g.setSkew(.05);
    // g.setPlayerSize(new Size(97, 100))
    // g.setPlayerDistanceMult(.1);
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
    g.setRotation(g.getRotation() - ((time / .930 - Math.ceil(time / .930)) * 5 + 2))
    g.setMainColor(Color.hsvToRgb(time * 0.2, 1, 1))
    g.setWallSpeedMult(g.getWallSpeedMult() + ft/10)
    // g.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
    g.setRadius(Math.sin(time*10)* 5 + 60);
}

level.onRender = ft => {
    time += ft;
    g.setSkew(Math.sin(time*10) * .1 + .1)
}

level.onLoad = () => {
    // g.createInterval(() => {
    //     const rnd = Math.random() * g.getSides()
    //     for (let i = 1; i < g.getSides(); i++) {
    //         g.createWall(i + rnd, 40)
    //     }
    // }, .8)
}
