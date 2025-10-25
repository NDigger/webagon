
import * as PIXI from 'pixi.js';
import { Vector2, Color } from './gameContent';
import Lerp from './utils/interpolation';
import Level from './gameContent/level';

(async () => {
    // APP DEFINITION && CONFIGURATION
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
        resolution: devicePixelRatio,
        antialias: true
    });

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);

    // GAME

    const level = new Level(app);
    const game = level.game;

    level.onInit = game => {
        game.setSwapEnabled(true);
        game.setRotationSpeed(.05);
        game.setWallSpeedMult(3);
        game.setWallSpawnDistance(1500);
        game.setSides(7);
        game.set3dDepth(5);
        game.set3dDistance(5);
        // game.set3dColor(new Color(255, 255, 255));
        // game.set3dFalloffColor(new Color(0, 0, 0));
        game.setRadius(100);
    }
    level.start()

    let time = 0;
    level.onUpdate = (game, ft) => {
        time += ft;
        game.setBackgroundTileColors([
            // Lerp.interpolate(Color.hsvToRgb(time * 0.0002, 1, .25), Color.hsvToRgb(time * 0.0002, 0, .95), time/960-Math.floor(time/960)),
            Color.hsvToRgb(time * 0.0002, 1, .25),
            Color.hsvToRgb(time * 0.0002, 1, .2),
        ])
        game.setRotation(game.getRotation() - ((time / 960 - Math.ceil(time / 960)) * 5 + 2))
        game.setMainColor(Color.hsvToRgb(time * 0.0002, 1, 1))
        game.setRadius(Math.sin(time / 100)* 5 + 60);
        game.setSkew(Math.sin(time/100) * .1 + .1)
    }

    // game.onRenderStage = ft => {
    //     time += ft;
    // }

    setInterval(() => {
        const rnd = Math.random() * level.game.getSides()
        for (let i = 1; i < level.game.getSides(); i++) {
            level.game.createWall(i + rnd, 40)
        }
    }, 600)

    // setTimeout(() => {
    //     game.kill()
    // }, 2840)
})()
