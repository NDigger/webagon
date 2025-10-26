
import LevelLoader from './gameContent/levelLoader';

var level
(async () => {
    level = new LevelLoader();
    await level.init();

    level.load();
})()

export default level;
