
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

import GameLerp from '../../../game/gameLerp';

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 500, 300);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), 300, 300);
    else if (pKey === 2) await patterns.pSpiral(Utils.mathRandom(7, 9), 100, 300, 1);
    else if (pKey === 3) await patterns.pRandomBarrage(Utils.mathRandom(3, 4), 300, 400);
    else if (pKey === 4) await patterns.pTunnel(Utils.mathRandom(2, 3), 700, 600);
    else await level.distanceDelay(1)
}

let pKeys = [];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setMainColor(new Color(255, 0, 0));
    level.setRadius(50);
    level.setWallSpeedMult(2);
    level.setRotationSpeed(-0.01);
    level.setSides(6);
    level.set3dLayersCount(4);
    level.set3dDistance(10);
    level.setIncrementTime(999999);
    level.setPlayerSize(new Size(15, 10))
    new GameLerp(v => level.setOffset(v)).run(new Vector2(0, 500), new Vector2(0, 0), 7, Utils.easeInOut)
    new GameLerp(v => level.setCenterOffset(v)).run(new Vector2(0, 500), new Vector2(0, 0), 7, Utils.easeInOut)

    level.setBackgroundTileColors([
        Color.hsvToRgb(.4, 1., .13),
        Color.hsvToRgb(.4, 1., .18),
    ])
    level.setMainColor(Color.hsvToRgb(.4, 1, .6))
    level.setBackgroundSwapTime(9999999);
    level.setScale(new Vector2(1.5, 1.5));
    level.setSkew(0.05);
    const offset = 1.5;
    const timings = [8.83, 9.33, 9.8, 10.2, 10.73, 11.19, 11.63, 12.13, 12.63, 13.03, 13.5, 14, 14.43, 14.9, 15.3, 15.83, 16.26, 16.8, 17.23, 17.66, 18.13, 18.63, 19.13, 19.6, 20.03, 20.5, 21, 21.43, 21.93, 22.39, 22.83, 23.33, 23.8, 24.23, 24.65, 25.16, 25.63, 26.06, 26.56, 27, 27.43, 27.96, 28.43, 28.8, 29.36, 29.6, 29.86, 30.06, 30.26, 30.46, 30.73, 30.83, 31, 31.06, 31.19, 31.43, 31.63, 32.13, 32.39, 32.6, 33.03, 33.26, 33.53, 34, 34.23, 34.46, 34.93, 35.16, 35.39, 35.83, 36.06, 36.33, 36.79, 37, 37.23, 37.73, 37.83, 37.96, 38.06, 38.2, 38.33, 38.39, 38.56, 38.63, 38.86, 39.06, 39.6, 39.79, 40.03, 40.4, 40.7, 40.96, 41.4, 41.66, 41.83, 42.36, 42.6, 42.79, 43.26, 43.46, 43.73, 44.23, 44.4, 44.63, 45.13, 45.36, 45.6, 45.76, 45.83, 46, 46.06, 46.26, 46.53, 47, 47.23, 47.43, 47.93, 48.16, 48.39, 48.83, 49.1, 49.39, 49.86, 50.03, 50.23, 50.76, 51, 51.23, 51.7, 51.93, 52.16, 52.63, 52.8, 53.06, 53.56, 53.73, 54, 54.46, 54.66, 54.93, 55.39, 55.63, 55.86, 56.33, 56.56, 56.79, 57.23, 57.4, 57.7, 58.2, 58.39, 58.63, 59.06, 59.36, 59.6, 60.03, 60.23, 60.53, 61, 61.2, 61.43, 61.86, 62.13, 62.39, 62.83, 63.03, 63.26, 63.76, 64, 64.23, 64.66, 64.93, 65.2, 65.6, 65.83, 66.06, 66.59, 66.76, 67.03, 67.46, 67.7, 67.93, 68.43, 68.63, 68.86, 69.36, 69.59, 69.83, 70.26, 70.5, 70.73, 71.2, 71.43, 71.66, 72.13, 72.36, 72.59, 73.03, 73.26, 73.53, 74, 74.23, 74.43, 74.93, 75.16, 75.4, 76.26, 77.23, 78.2, 79.1, 80.03, 81, 81.46, 81.66, 81.93, 82.13, 82.36, 82.59, 82.83, 83.06, 83.79, 84.66, 85.63, 86.63, 87.43, 88.4, 88.83, 89.09, 89.33, 89.56, 89.83, 90.03, 90.29, 90.53, 91.2, 92.13, 93.03, 94, 94.9, 95.8, 96.26, 96.53, 96.76, 97.03, 97.23, 97.43, 97.66, 97.93, 98.2, 98.6, 99.23, 99.33, 99.59, 100.03, 100.46, 101.09, 101.2, 101.46, 101.86, 102.33, 102.96, 103.03, 103.23, 103.76, 104.20, 104.79, 104.86, 105.13, 105.59, 106.03, 106.66, 106.76, 106.96, 107.43, 107.93, 108.56, 108.79, 109.33, 109.83, 110.36, 110.53, 110.79, 111.2, 111.6, 112.16, 112.59, 113.06, 113.56, 113.76, 114.03, 114.23, 114.46, 114.96, 115.03, 115.16, 115.26, 115.4, 115.6, 115.9, 116, 116.06, 116.2, 116.33, 116.43, 116.79, 117.26, 118.16, 119.09, 120.03, 120.96, 121.86, 122.83, 123.76, 124.20, 124.6, 125.59, 126.53, 127.43, 128.43, 129.33, 130.23, 131.16, 131.63, 132.13, 133, 133.96, 134.86, 135.83, 136.76, 137.66, 138.59, 139.03, 139.59, 140.53, 141.43, 142.36, 143.26, 144.23, 145.16, 146.06, 146.56, 147.03, 147.43, 147.93, 148.4, 148.9, 149.36, 149.83, 150.23, 150.76, 151.19, 151.66, 152.13, 152.59,
        153.06, 153.53, 154.03, 154.43, 154.93, 155.36, 155.83, 156.33, 156.76, 157.23, 157.73, 158.16, 158.63, 159.06, 159.56, 160.03
    ]

    level.createEvent(7 - offset, () => {
        pKeys = [0, 1, 2, 3, 4];
    })
    level.createEvent(8.83 - offset, () => {
        level.setRotationSpeed(0.02)
    })
    level.createEvent(16.23 - offset, () => {
        level.setRotationSpeed(-0.04)
    })
    const playerRadiusLerp = new GameLerp(v => level.setRadius(v));
    const wallScaleLerp = new GameLerp(v => level.setWallScale(v));
    timings.forEach((timing, i) => level.createEvent(timing - offset, () => {
        const hue = Utils.fract(level.getTime() * 23.84195);
        level.setMainColor(Color.hsvToRgb(hue, 1, .6))
        level.setBackgroundTileColors([
            Color.hsvToRgb(hue, 1., .13),
            Color.hsvToRgb(hue, 1., .18),
        ])
        const t = Math.max(0, Math.min(.8, (timings[i+1]??0) - timing))
        playerRadiusLerp.run(50 + t * 20, 50, t, Utils.easeIn)
        wallScaleLerp.run(new Vector2(1 + t*.2, 1 + t*.2), new Vector2(1, 1), t, Utils.easeInOut)
    }))
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
    console.log(ft)
    GameLerp.updateAll(ft);
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
