
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

    // game.setRotationSpeed(0.1);
    game.setWallSpeedMult(3);
    game.setWallSpawnDistance(1500);
    game.setSides(5);
    game.setSkew(0.5);
    game.set3dDepth(5);
    game.set3dDistance(100);

    let time = 0;
    game.onUpdate = ft => {
        time += ft;
        game.setBackgroundTileColors([
            Color.hsvToRgb(time * 0.0002, 1, .2),
            Color.hsvToRgb(time * 0.0002, 1, .25),
        ])
        game.setRotation(game.getRotation() - ((time / 970 - Math.ceil(time / 970)) * 15 + 10))
        game.setMainColor(Color.hsvToRgb(time * 0.0002, 1., 1.))
        game.setSkew(Math.sin(time / 200)*.3+1.);
        game.setRadius(Math.sin(time / 100)* 5 + 60);
    }

    setInterval(() => {
        const rnd = Math.random() * game.getSides()
        for (let i = 1; i < game.getSides(); i++) {
            game.createWall(i + rnd, 40)
        }
    }, 500)

    setTimeout(() => {
        game.kill()
    }, 2400)

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
})()
