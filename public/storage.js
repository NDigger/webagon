export const getLevelsStats = () => {
    const item = localStorage.getItem('webagon-level-stats');
    return item ? JSON.parse(item) : {};
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

export const defaultConfig = {
    playerTiltMult: 0.4,
    swapHighlightEnabled: true,
    displayFpsEnabled: true,
    displayUiEnabled: true,
    musicVolume: 0.8,
    soundsVolume: 0.8,
}

export const getConfig = () => {
    const item = localStorage.getItem('webagon-config');
    return item ? JSON.parse(item) : defaultConfig;
}

export const writeConfig = config => localStorage.setItem('webagon-config', JSON.stringify(config));
