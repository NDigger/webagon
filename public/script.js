
import * as PIXI from 'pixi.js';
import { Vector2, Color } from './gameContent';
import Game from './gameContent/game';
import DrawHandler from './gameContent/drawHandler';

(async () => {
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
        resolution: devicePixelRatio,
        antialias: true
    });
    app.canvas.style.position = 'absolute';
    app.canvas.style.maxWidth = '100vw';
    app.canvas.style.maxHeight = '100vh';

    const game = new Game({
        pixiApp: app,
        drawHandler: new DrawHandler(),
    });

    game.setRotationSpeed(0.1);
    game.setWallSpeedMult(3);
    game.setWallSpawnDistance(800);
    game.setSides(8);
    game.setSkew(0.5);
    // game.setRadius(00);

    let time = 0;
    game.onUpdate = ft => {
        time += ft;
        game.setBackgroundTileColors([
            Color.hsvToRgb(time * 0.0002, 1, .2),
            Color.hsvToRgb(time * 0.0002, 1, .25)
        ])
        game.setMainColor(Color.hsvToRgb(time * 0.0002, 1., 1.))
        game.setSkew(Math.sin(time / 400)*1+1);
        // game.setRadius(Math.sin(time / 100)* 5 + 60);
    }

    setInterval(() => {
        game.createWall(Math.random() * 6, 40)
        // game.setRotation(Math.random() * 360)
    }, 100)

    setTimeout(() => {
        // game.kill()
    }, 2500)

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
})()
