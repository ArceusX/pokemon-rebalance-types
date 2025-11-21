import {FX_SCORES} from "./TypeData.js"


const STD = (array) => {
  const n = array.length;
  if (n === 0) return 0;
  const mean = array.reduce((acc, val) => acc + val, 0) / n;
  const variance = array.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
};

const getFXness = (value) => FX_SCORES[value] ?? 0;

const calcStats = (typeDamage) => {
  const stats = {
    ATK: Array(19).fill(0),
    DEF: Array(19).fill(0),
    TOTAL: Array(19).fill(0)
  };

  for (let iType = 0; iType < 18; iType++) {
    let sumATK = 0, sumDEF = 0;
    
    for (const value of typeDamage[iType].values) {
      sumATK += getFXness(value);
    }
    stats.ATK[iType] = sumATK;

    for (const row of typeDamage) {
      sumDEF -= getFXness(row.values[iType]);
    }
    stats.DEF[iType] = sumDEF;
    stats.TOTAL[iType] = sumATK + sumDEF;
  }

  // Calculate standard deviations
  stats.ATK[18] = STD(stats.ATK.slice(0, -1));
  stats.DEF[18] = STD(stats.DEF.slice(0, -1));
  stats.TOTAL[18] = STD(stats.TOTAL.slice(0, -1));

  return stats;
};

const getNextValue = (currentValue) => {
  const cycle = { '0': '½', '½': '', '': '2', '2': '0' };
  return cycle[currentValue] || currentValue;
};

export { STD, getFXness, calcStats, getNextValue };