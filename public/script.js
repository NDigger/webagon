
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

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
})()
