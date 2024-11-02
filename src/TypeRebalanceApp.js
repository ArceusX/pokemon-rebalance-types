import React, {useState, useRef} from 'react';
import TypeChart from './TypeChart'
import TypeDiffCount from './TypeDiffCount';
import TypeStatsTable from './TypeStatsTable';
import Footer from './Footer';

const getFXness = (value) => {
  switch (value) {
    case "0": return -2;
    case "½": return -1;
    case "" : return 0;
    case "2": return 1;
    default :
  }
};

function STD(array) {   
  const n = array.length;
  if (n === 0) return 0;

  const mean = array.reduce((acc, val) => acc + val, 0) / n;
  const variance = array.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
}

const TypeRebalanceApp = ({ srcTypeDamage }) => {
  
  const calcStats = (typeDamage) => {
    let stats = {
      ATK: Array(19).fill(0),
      DEF: Array(19).fill(0),
      TOTAL: Array(19).fill(0)
    }
  
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
  
    return calcSTD(stats);
  };

  const calcSTD = (stats) => {
    stats.ATK[18]   = STD(stats.ATK.slice(0, -1));
    stats.DEF[18]   = STD(stats.DEF.slice(0, -1));
    stats.TOTAL[18] = STD(stats.TOTAL.slice(0, -1));
    
    return stats;
  }

  const [typeDamage, setTypeDamage] = useState(JSON.parse(JSON.stringify(srcTypeDamage)));
  const [stats, setStats] = useState(calcStats(typeDamage));
  const [diffCount, setDiffCount] = useState(0);
  const fileUploadRef = useRef(null);

  const updateDiffCount = (rowIndex, colIndex, newValue) => {
    let srcValue = srcTypeDamage[rowIndex].values[colIndex];
    let oldValue = typeDamage[rowIndex].values[colIndex];
    let wasChanged = (srcValue !== oldValue)
    let isChanged  = (srcValue !== newValue);

    setDiffCount(diffCount + isChanged - wasChanged);
  }

  const updateTypeDamage = (rowIndex, colIndex, newValue) => {
    // Update stats before prior value in typeDamage is overwritten
    updateStats(rowIndex, colIndex, newValue);

    updateDiffCount(rowIndex, colIndex, newValue);

    const newDamage = [...typeDamage];
    newDamage[rowIndex].values[colIndex] = newValue;
    setTypeDamage(newDamage);
  };

  // Set newStats on newValue being put in [iATK][iDEF] entry of typeDamage
  function updateStats(iATK, iDEF, newValue) {
    const newStats = {
      ATK: [...stats.ATK],
      DEF: [...stats.DEF],
      TOTAL: [...stats.TOTAL],
    };

    // ie FXness: 1x → 2x gives change == 1, so +1 to ATK type and -1 to DEF type
    const change = getFXness(newValue) - getFXness(typeDamage[iATK].values[iDEF]);
    newStats.ATK[iATK] += change;
    newStats.DEF[iDEF] -= change;

    newStats.TOTAL[iATK] = newStats.ATK[iATK] + newStats.DEF[iATK];
    newStats.TOTAL[iDEF] = newStats.DEF[iDEF] + newStats.ATK[iDEF];

    setStats(calcSTD(newStats));
  }

  function updateRowStats(iATK) {
    const newStats = {
      ATK:   [...stats.ATK],
      DEF:   [...stats.DEF],
      TOTAL: [...stats.TOTAL],
    };

    const ATKDamage = typeDamage[iATK]
    let changeSum = 0;
    for (let iDEF = 0; iDEF < 18; iDEF++) {
      const change = getFXness(ATKDamage.values[iDEF]);
      changeSum += change;

      // ie If Water (iATK) deals 2x to Fire (iDEF) prior, on row clear,
      // Water now deals 1x, so DEF & TOTAL of Fire rise by 1 
      newStats.DEF[iDEF]   += change;
      newStats.TOTAL[iDEF] += change;
    }

    // Change's effect to ATK type's stat is reverse of that to DEF type's 
    newStats.ATK[iATK]  = 0;
    newStats.TOTAL[iATK] -= changeSum;

    setStats(calcSTD(newStats));
  }
  
  // Called by onDoubleClick of TypeTh in TypeChart
  const clearRow = (index) => {
    // Update stats before prior values in typeDamage are overwritten
    updateRowStats(index);

    const newDamage = typeDamage.map((row, rowIndex) => {
      if (rowIndex === index) {
        let rowDiffCount = 0; 
        for (let colIndex = 0; colIndex < 18; colIndex++) {
          const srcValue = srcTypeDamage[rowIndex].values[colIndex];
          const oldValue = typeDamage[rowIndex].values[colIndex];
          const isChanged  = (srcValue !== "");
          const wasChanged = (srcValue !== oldValue);

          rowDiffCount += isChanged - wasChanged;
        }
        setDiffCount(diffCount + rowDiffCount);

        return { ...row, values: Array(row.values.length).fill("") };
      }
      return row;
    });
    setTypeDamage(newDamage);
  };

  const clearChart = () => {
    const newDamage = typeDamage.map(row => ({
        type: row.type,
        values: new Array(row.values.length).fill("")
    }));
    setTypeDamage(newDamage);
    setDiffCount(120);
    setStats({
      ATK: Array(19).fill(0),
      DEF: Array(19).fill(0),
      TOTAL: Array(19).fill(0)
    });
  };

  const downloadChart = () => {
    let now = (new Date()).toLocaleString();
    let content = `Pokémon Type Rebalancing — ${now}\n\n`;
    
    // 18 lines of 18 comma-separated-values
    for (let rowIndex = 0; rowIndex < 18; rowIndex++) {
        content += typeDamage[rowIndex].values.join(',') + '\n';
    }

    let blob = new Blob([content], { type: 'text/csv; charset=utf-8;' });
              
    // Firefox requires clicked link to be added to document
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "typechart.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n').slice(2);
      const data = lines.map(line => line.split(','));

      let newDamage = [...typeDamage];
      let newDiffCount = 0;
      for (let rowIndex = 0; rowIndex < 18; rowIndex++) {
        for (let colIndex = 0; colIndex < 18; colIndex++) {
          const value = data[rowIndex][colIndex];
          newDamage[rowIndex].values[colIndex] = value;
          newDiffCount += (value !== srcTypeDamage[rowIndex].values[colIndex])
        }
      }
      setTypeDamage(newDamage);
      setDiffCount(newDiffCount);
      setStats(calcStats(typeDamage));
    }
    reader.readAsText(file);
  };
  
  return (
  <div id="type-rebalance-app">
    <h2 id="title">Pokémon Type Rebalancing</h2>
    <div id="btn-container">
      <input
      id="file-upload"
      type="file"
      accept=".csv"
      hidden
      ref={fileUploadRef}
      onChange={handleUpload}
    />
        <button id="btn-upload" onClick={() => fileUploadRef.current.click()}>Upload</button>
        <button id="btn-clear" onClick={clearChart}>Clear All</button>
        <button id="btn-download" onClick={downloadChart}>Download</button>
    </div>

    <TypeChart typeDamage = {typeDamage}
        TdUpdate={updateTypeDamage} ThOnDoubleClick={clearRow}/>
    <TypeDiffCount text="Changes : " diffCount={diffCount} />
    <TypeStatsTable stats={stats} typeDamage = {typeDamage}/>
    <Footer author="Triet Lieu" link="https://github.com/ArceusX/pokemon-type-rebalance" />
  </div>
)
};

export default TypeRebalanceApp;
