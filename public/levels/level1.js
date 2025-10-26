
import { Vector2, Color, Size } from '../utils/structures';
import Lerp from '../utils/interpolation';
import level from '../script';

level.onInit = () => {
    const g = level.game;
    g.setSwapEnabled(true);
    g.setRotationSpeed(0.1);
    g.setWallSpeedMult(1);
    g.setWallSpawnDistance(1500);
    g.setSides(6);
    g.set3dDepth(20);
    g.set3dDistance(10);
    // g.set3dColor(new Color(255, 255, 255));
    g.set3dFalloffColor(new Color(0, 0, 0));
    g.setSkew(.05);
    // g.setPlayerSize(new Size(97, 100))
    // g.setPlayerDistanceMult(.1);
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    const g = level.game;
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
    // g.setRotation(g.getRotation() - ((time / .940 - Math.ceil(time / .940)) * 5 + 2))
    g.setMainColor(Color.hsvToRgb(time * 0.2, 1, 1))
    g.setWallSpeedMult(g.getWallSpeedMult() + ft)
    // g.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
    g.setRadius(Math.sin(time*10)* 5 + 60);
}

level.onRender = ft => {
    time += ft;
    const g = level.game;
    g.setSkew(Math.sin(time*10) * .1 + .1)
}

level.onLoad = () => {
    const g = level.game;
    g.createInterval(() => {
        const rnd = Math.random() * g.getSides()
        for (let i = 1; i < g.getSides(); i++) {
            g.createWall(i + rnd, 50)
        }
    }, .8)
}
