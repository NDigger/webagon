
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
    let time = 0;
    game.onUpdate = ft => {
        time += ft;
        game.setSkew(Math.sin(time / 500)* .5 + 1);
        game.setRadius(Math.sin(time / 100)* 5 + 60);
    }

    setInterval(() => {
        game.createWall(Math.random() * 6, 40)
    }, 100)

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
})()
