// src/utils/localStorage.ts
const LAST_CLEARED_LEVEL_KEY = 'mathTricksLastClearedLevel';

export const getLastClearedLevel = (): number => {
  const savedLevel = localStorage.getItem(LAST_CLEARED_LEVEL_KEY);
  if (savedLevel) {
    const level = parseInt(savedLevel, 10);
    return !isNaN(level) && level >= 0 ? level : 0; // Default to 0 if invalid
  }
  return 0; // Default if nothing is saved
};

export const saveLastClearedLevel = (level: number): void => {
  if (level >= 0) {
     localStorage.setItem(LAST_CLEARED_LEVEL_KEY, level.toString());
  }
};
