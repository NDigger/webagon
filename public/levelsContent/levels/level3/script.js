
import { Vector2, Color, Size } from '../../../utils/structures';
import Lerp from '../../../utils/interpolation';
import { level } from '../../../script';

level.onInit = () => {
    level.setSwapEnabled(true);
    level.setRotationSpeed(.5);
    level.setWallSpeedMult(6);
    level.setWallSpawnDistance(1500);
    level.setSides(4);
    level.set3dDepth(4);
    level.set3dDistance(50);
    // level.set3dColor(new Color(255, 255, 255));
    level.setSkew(1);
    level.setScale(new Vector2(.5, 1))
    // level.setPlayerSize(new Size(97, 100))
    // level.setPlayerDistanceMult(.1);

    level.createInterval(() => {
        const rnd = Math.random() * level.getSides()
        for (let i = 1; i < level.getSides(); i++) {
            level.createWall(i + rnd, 50)
        }
    }, .4)
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
        // Lerp.interpolate(Color.hsvToRgb(time * 0.2, 1, 0.5), Color.hsvToRgb(time * 0.2, 1, 0.1), (time/940-Math.floor(time/940))),
        // Lerp.interpolate(Color.hsvToRgb(time * 0.2, 1, 0.4), Color.hsvToRgb(time * 0.2, 1, 0.2), (time/940-Math.floor(time/940))),

        // Color.hsvToRgb(time * 0.2, 1, .25),
        // Color.hsvToRgb(time * 0.2, 1, .2),
        Color.BLACK(),
        Color.hsvToRgb(time * .5, .5, .1)
    ])
    level.setRotationSpeed(level.getRotationSpeed() + 0.1*ft)
    level.setMainColor(Color.hsvToRgb(time * 0.5, 1, 1))
    // level.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
    level.setRadius(Math.sin(time*10)* 5 + 60);
}

level.onRender = ft => {
    time += ft;
    // level.setSkew(Math.sin(time*10) * .1 + .1)
}