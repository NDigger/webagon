
import * as PIXI from 'pixi.js';
import { Vector2, Color } from './gameContent';
import Game from './gameContent/game';

(async () => {
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
    });
    app.canvas.style.position = 'absolute';

    const game = new Game(app);
    let time = 0;
    game.onUpdate = ft => {
        time += ft;
        game.setSkew(Math.sin(time / 500)* .5 + 1);
    }

    setInterval(() => {
        game.createWall(Math.random() * 6, 40)
    }, 100)

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
})()
