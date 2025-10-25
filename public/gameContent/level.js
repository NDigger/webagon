import Game from "./game";
import DrawHandler from './drawHandler';

export default class Level {
    static createTimeLevel(app) {
        return {
            game: 
            new Game({
                pixiApp: app,
                drawHandler: new DrawHandler(),
            })
        }
    }
}