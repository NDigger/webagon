import { Vector2, Color, Size, Lerp, level } from '../../common'

level.onInit = () => {
    // level.setSwapEnabled(true);
    level.setRotationSpeed(0.3);
    level.setWallSpeedMult(500);
    level.setSides(3);
    level.set3dDepth(500);
    level.set3dDistance(5);
    level.setRadius(80);
    level.setRotationSpeedIncrement(.1);
    level.setIncrementTime(5);
    level.setSkew(.5);
    level.set3dColor(new Color(0, 0, 0));
    level.createInterval(() => {
        const rnd = Math.random() * level.getSides()
        for (let i = 1; i < level.getSides(); i++) {
            level.createWall(i + rnd, 50)
        }
    }, .2)
}

let time = 0;
// onUpdate is called every frame.
level.onUpdate = ft => {
    level.setBackgroundTileColors([
            Lerp.interpolate(new Color(Lerp.interpolate(0, 25, Lerp.CapMode.pingPong(time)), 15, 55), new Color(25, 25, 25), Lerp.CapMode.pingPong(time*20)),
            Lerp.interpolate(new Color(Lerp.interpolate(0, 25, Lerp.CapMode.pingPong(time)), 15, 85), new Color(25, 25, 25), Lerp.CapMode.pingPong(time*20)),
        ])
    level.setMainColor(Lerp.interpolate(new Color(Lerp.interpolate(0, 255, Lerp.CapMode.pingPong(time)), 15, 255), new Color(255, 255, 255), Lerp.CapMode.pingPong(time*20)))
}

level.onRender = ft => {
    time += ft;
    // level.setSkew(Math.sin(time*10) * .1 + .1)
}