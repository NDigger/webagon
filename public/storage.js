export const getLevelsStats = () => {
    const webagonLevelStats = localStorage.getItem('webagon-level-stats');
    return webagonLevelStats ? JSON.parse(webagonLevelStats) : {};
}

export const getLevelStats = levelKey => {
    const levelsStats = getLevelsStats();
    return levelsStats[levelKey] ?? {};
}

export const writeLevelStats = (levelKey, levelStats) => {
    const levelsStats = getLevelsStats();
    levelsStats[levelKey] = levelStats;
    localStorage.setItem('webagon-level-stats', JSON.stringify(levelsStats));
}