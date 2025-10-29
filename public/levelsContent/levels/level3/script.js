import { Vector2, Color, Size, Lerp, level } from '../../common'

level.onInit = () => {
    level.setSwapEnabled(true);
    level.setRotationSpeed(.5);
    level.setWallSpeedMult(6);
    level.setWallSpawnDistance(1500);
    level.setSides(4);
    level.set3dDepth(20);
    level.set3dDistance(100);
    level.setMainColor(Color.WHITE());
    // level.set3dColor(new Color(255, 255, 255));
    level.setSkew(.2);
    level.set3dFalloffColor(new Color(0, 0, 0, 0));
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
        Lerp.interpolate(new Color(25, 15, 25), new Color(45, 25, 35), Lerp.CapMode.pingPong(time*20)),
        Lerp.interpolate(new Color(45, 15, 25), new Color(65, 25, 25), Lerp.CapMode.pingPong(time*20)),
    ])
    level.setMainColor(Lerp.interpolate(Color.RED(), new Color(255, 155, 255), Lerp.CapMode.pingPong(time*20)))
    level.setRotationSpeed(level.getRotationSpeed() + 0.1*ft)
    // level.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
}

level.onRender = ft => {
    time += ft;
    // level.setSkew(Math.sin(time*10) * .1 + .1)
}