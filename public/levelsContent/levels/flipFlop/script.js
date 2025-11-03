
import { Vector2, Color, Size, Lerp, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 420, 200);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), 300, 300);
    else if (pKey === 2) await patterns.pRandomBarrage(Utils.mathRandom(3, 4), 250, 400);
    else if (pKey === 3) await patterns.pTunnel(Utils.mathRandom(2, 3), 550, 400);
}

const pKeys = [0, 1, 2, 3];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setBackgroundRadius(1000);
    level.setRadius(90);
    level.setRotationSpeed(0.2);
    level.setWallSpeedMult(5);
    level.setSides(5);
    level.set3dDepth(9);
    level.set3dDistance(2);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.03);
    level.setIncrementTime(12);
    level.set3dFalloffColor(new Color(0, 0, 0, 0))
    level.setIncrementSpinPower(.7);
    level.set3dColor(Color.BLACK());
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
        Color.BLACK()
    ])

    const t = Lerp.CapMode.pingPong(Lerp.Easing.EASE_OUT(Lerp.CapMode.fract(time * 2.2)))
    level.setMainColor(Lerp.interpolate(new Color(0, 0, 0), Color.hsvToRgb(Lerp.CapMode.pingPong(time * 3) * .1 + .9, 1., .9), t))
    level.set3dFalloffColor(Lerp.interpolate(Color.hsvToRgb(Lerp.CapMode.pingPong(time * 3) * .1 + .9, 1., .9), new Color(0, 0, 0), t))
    const s = t * .5 + 1
    level.setWallScale(new Vector2(s, s))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    time += ft;
    level.setSkew(Lerp.CapMode.pingPong(time * 2)*.2 + .5)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
