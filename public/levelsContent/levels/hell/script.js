
import { Vector2, Color, Size, level } from '../../common'
import * as Utils from '../../utils'
import initPatterns from '../../patterns';
let patterns = initPatterns(level); // Patterns require level object in order to be spawned.

// Pattern spawn conditions, uses level.onStep
const addPattern = async pKey => {
    if (pKey === 0) await patterns.pInverseBarrage(Utils.mathRandom(2, 3), 650, 700);
    else if (pKey === 1) await patterns.pSpiralBarrage(Utils.mathRandom(4, 6), 350, 700);
    else if (pKey === 2) await patterns.pRandomBarrage(Utils.mathRandom(6, 9), 370, 700);
    else if (pKey === 3) await patterns.pTunnel(Utils.mathRandom(2, 3), 650, 700);
    else if (pKey === 4) await patterns.pSpiral(Utils.mathRandom(6, 8), 380, 600, 2)
    else if (pKey === 5) await patterns.pAltBarrage(Utils.mathRandom(3, 5), 380, 700)
}

const pKeys = [0, 1, 2, 2, 2, 3, 4, 5];
let activeKeys = [];

// onInit is called on the first frame when level is created.
level.onInit = () => {
    level.setRadius(90);
    level.setRotationSpeed(0);
    level.setSides(4);
    level.set3dLayersCount(5);
    level.set3dDistance(5);
    level.setWallSpeedIncrement(0.2);
    level.setRotationSpeedIncrement(0.03);
    level.setIncrementTime(999999);
    level.setIncrementSpinPower(.7);
    level.set3dDepthMult(.5);
    // level.setWallAngleLeft(-.5);
    level.setWallAngleRight(-.5);
    level.setBackgroundRotationOffset(45);
    level.setBackgroundRadius(40000);
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
    level.setBackgroundTileColors([
        new Color(25, 0, 0),
        new Color(45, 0, 0),
    ])

    level.setBackgroundRotationOffset(-level.getRotation() * 2)

    level.setWallSpeedMult(Math.min(5 + level.getTime() / 30, 9));

    const s = Utils.pingPong(Utils.easeOut(Utils.fract(level.getTime() * 1.1))) * .4 + 1
    level.setWallScale(new Vector2(s, s))

    level.setRadius(100 - Utils.fract(level.getTime() * 3) * 20)
    

    const rSpeed = level.getTime()/300 + .25
    level.setRotationSpeed(Math.floor(level.getTime() * 1.1) % 2 === 0 ? rSpeed : -rSpeed)
    level.setBackgroundSwapTime(5 / level.getTime())
    level.setShakePower(2+level.getTime()/30)

    const t = Utils.pingPong(level.getTime() * (level.getTime() / 50 + 1))
    level.setMainColor(Utils.interpolate(Color.RED(), new Color(0, 0, 0), t))
}

// onRender is called every frame. It works when player is died.
level.onRender = ft => {
    level.setSkew(Utils.pingPong(level.getTime() * 2)*.1 + 1.5)
}

// onPreIncrement is called immediately when increment time is achieved
level.onPreIncrement = () => {}

// onIncrement is called every time walls are gone and level speed incremented
level.onIncrement = () => {}

// onDeath is called when main player of level object touches deadly wall side
level.onDeath = () => {}
