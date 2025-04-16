const LAST_CLEARED_LEVEL_KEY = 'mathTricksLastClearedLevel';

export const getLastClearedLevel = (): number => {
  const savedLevel = localStorage.getItem(LAST_CLEARED_LEVEL_KEY);
  if (savedLevel) {
    const level = parseInt(savedLevel, 10);
    return !isNaN(level) && level >= 0 ? level : 0;
  }
  return 0;
};

export const saveLastClearedLevel = (level: number): void => {
  if (level >= 0) {
     localStorage.setItem(LAST_CLEARED_LEVEL_KEY, level.toString());
  }
};
