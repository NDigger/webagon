
import * as PIXI from 'pixi.js';
import { Vector2, Color } from './gameContent';
import Lerp from './utils/interpolation';
import Game from './gameContent/game';
import DrawHandler from './gameContent/drawHandler';

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

    const game = new Game({
        pixiApp: app,
        drawHandler: new DrawHandler(),
    });

    game.setRotationSpeed(0.05);
    game.setWallSpeedMult(2);
    game.setWallSpawnDistance(1000);
    game.setSides(3);
    game.set3dDepth(5);
    game.set3dDistance(10);

    let time = 0;
    game.onUpdate = ft => {
        time += ft;
        game.setBackgroundTileColors([
            Color.hsvToRgb(time * 0.0002, 1, .2),
            Color.hsvToRgb(time * 0.0002, 1, .25),
        ])
        // game.setRotation(game.getRotation() - ((time / 960 - Math.ceil(time / 970)) * 5 + 2))
        game.setMainColor(Color.hsvToRgb(time * 0.0002, 1., 1.))
        game.setSkew(Math.sin(time / 120)*.1+.1);
        game.setRadius(Math.sin(time / 100)* 5 + 60);
    }

    setInterval(() => {
        const rnd = Math.random() * game.getSides()
        for (let i = 1; i < game.getSides(); i++) {
            game.createWall(i + rnd, 40)
        }
    }, 600)

    // setTimeout(() => {
    //     game.kill()
    // }, 2840)
})()
