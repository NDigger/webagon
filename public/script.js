
import * as PIXI from 'pixi.js';
import { Vector2, Color } from './gameContent';
import Lerp from './utils/interpolation';
import Game from './gameContent/game';
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

    const { game } = Level.createTimeLevel(app);

    game.setSwapEnabled(true);
    game.setRotationSpeed(.05);
    game.setWallSpeedMult(3);
    game.setWallSpawnDistance(1000);
    game.setSides(4);
    game.set3dDepth(5);
    game.set3dDistance(200);
    // game.set3dColor(new Color(255, 255, 255));

    game.onDeath = () => {
        game.setBackgroundTileColors([
            // Lerp.interpolate(Color.hsvToRgb(time * 0.0002, 1, .25), Color.hsvToRgb(time * 0.0002, 0, .95), time/960-Math.floor(time/960)),
            Color.hsvToRgb(time * 0.0002, 1, .25),
            Color.hsvToRgb(time * 0.0002, 1, .2),
        ])
    }

    let time = 0;
    game.onUpdate = ft => {
        game.setBackgroundTileColors([
            // Lerp.interpolate(Color.hsvToRgb(time * 0.0002, 1, .25), Color.hsvToRgb(time * 0.0002, 0, .95), time/960-Math.floor(time/960)),
            Color.hsvToRgb(time * 0.0002, 1, .25),
            Color.hsvToRgb(time * 0.0002, 1, .2),
        ])
        // game.setRotation(game.getRotation() - ((time / 960 - Math.ceil(time / 960)) * 5 + 2))
        game.setMainColor(Color.hsvToRgb(time * 0.0002, 1, 1))
        game.set3dFalloffColor(Color.hsvToRgb(time * 0.0002 + .5, 1, 1));
        game.setRadius(Math.sin(time / 100)* 5 + 60);
        const s = 1.+(time/460 - Math.floor(time / 460)) * .1
        game.setScale(new Vector2(s, s));
    }

    game.onRenderStage = ft => {
        time += ft;
        game.setSkew(Math.sin(time / 120)*.1+.1);
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
