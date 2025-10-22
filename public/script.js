
import * as PIXI from 'pixi.js';
import * as Game from './gameContent';
import { Vector2, Color } from './gameContent';

(async () => {
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
    });
    app.canvas.style.position = 'absolute';

    const background = new Game.Background(app);
    background.setSides(background.getSides() + 0.01)
    background.setTileColors([
        new Color(65, 110, 155),
        new Color(85, 110, 155),
        new Color(105, 110, 155)
    ])
    background.setSkew(2);

    const shape = new Game.Shape(app);
    shape.setColor(new Color(155, 160, 215));
    shape.setLayer(0.01);
    
    // const wall = new Game.CustomWall(app);
    // wall.setVertexPos(0, new Vector2(0, 0))
    // wall.setVertexPos(1, new Vector2(0, 100))
    // wall.setVertexPos(2, new Vector2(100, 100))
    // wall.setVertexPos(3, new Vector2(100, 0))
    // wall.setColor(new Color(255, 255, 0))
    // wall.setLayer(20)

    const step = t => {
        background.setSkew(Math.sin(t/500) + 1)
        background.setRotation(t / 10)

        shape.setSkew(Math.sin(t/500) + 1)
        shape.setRotation(t / 10)
        requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    
    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
})()
