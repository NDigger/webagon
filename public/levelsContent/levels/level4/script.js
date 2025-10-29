import { Vector2, Color, Size, Lerp, level } from '../../common'

level.onInit = () => {
    level.setRotationSpeed(0);
    level.setWallSpeedMult(2);
    level.setSides(5);
    level.set3dDepth(3);
    level.set3dDistance(5);
    level.setSkew(.1);
    level.setMainColor(new Color(255, 255, 255))
    // level.set3dColor(new Color(255, 255, 255));
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
        Color.RED(),
        Color.GREEN(),
        Color.BLUE(),
        Color.CYAN(),
    ])
    // level.setRadius(80 - (time * 2 - Math.floor(time * 2)) * 10)
    level.setRadius(Math.sin(time*10)* 5 + 60);
}

level.onRender = ft => {
    time += ft;
    // level.setSkew(Math.sin(time*10) * .1 + .1)
}