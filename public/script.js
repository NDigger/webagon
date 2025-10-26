
import LevelLoader from './gameContent/levelLoader';

var level
(async () => {
    level = new LevelLoader();
    await level.init();

    level.load('./levels/level1.js');
})()

export default level;
