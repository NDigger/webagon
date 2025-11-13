export const getLevelsStats = () => {
    const webagonLevelStats = localStorage.getItem('webagon-level-stats');
    return webagonLevelStats ? JSON.parse(webagonLevelStats) : {};
}

export const getLevelStats = (levelKey, levelDiff) => {
    const levelsStats = getLevelsStats();
    const levelStatsAllDiffs = levelsStats[levelKey] ?? {};
    return levelStatsAllDiffs[levelDiff] ?? {};
}

export const writeLevelStats = (levelKey, levelDiff, levelStats) => {
    const levelsStats = getLevelsStats();
    const levelStatsAllDiffs = levelsStats[levelKey] ?? {};
    levelStatsAllDiffs[levelDiff] = levelStats;
    levelsStats[levelKey] = levelStatsAllDiffs;
    localStorage.setItem('webagon-level-stats', JSON.stringify(levelsStats));
}