
import * as PIXI from 'pixi.js';
import { Vector2, Color } from './gameContent';
import Game from './gameContent/game';

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

    const game = new Game(app);

    game.setRotationSpeed(0.1);
    game.setWallSpeedMult(4);
    game.setWallSpawnDistance(1000);

    let time = 0;
    game.onUpdate = ft => {
        time += ft;
        game.setBackgroundTileColors([
            Color.hsvToRgb(time / 1000, .1, .8),
            Color.hsvToRgb(time / 1000, .1, .7)
        ])
        game.setMainColor(Color.hsvToRgb(time * 0.001, 1., 1.))
        game.setSkew(Math.sin(time / 500)* .5+ 1);
        game.setRadius(Math.sin(time / 100)* 5 + 60);
    }

        game.createWall(Math.random() * 6, 40)

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
