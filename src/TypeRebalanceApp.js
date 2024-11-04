import React, {useState, useRef} from 'react';
import TypeChart from './TypeChart'
import TypeDiffCount from './TypeDiffCount';
import TypeStatsTable from './TypeStatsTable';
import Footer from './Footer';

function STD(array) {   
  const n = array.length;
  if (n === 0) return 0;

  const mean = array.reduce((acc, val) => acc + val, 0) / n;
  const variance = array.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
}

// For stat computation, convert text value to numerical score
const getFXness = (value) => {
  switch (value) {
    case "0": return -2;
    case "½": return -1;
    case "" : return 0;
    case "2": return 1;
    default :
  }
};

// Holds typeDamage data and executes logic for its subcomponents:
//    1. Buttons to clear, upload, and download chart (not in component)
//    2. TypeChart     : Table allowing user to modify values in typeDamage
//    3. TypeDiffCount : Label that displays count of changes to official table
//    4. TypeStatsTable: Uninteractable; displays stats computed from typeDamage 
const TypeRebalanceApp = ({ srcTypeDamage }) => {
  
  // On loading new chart, call this to fully recalculate stats
  // Each of first 18 columns holds stats for type; final column
  // holds std dev of respective stat for all types 
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
  
      // Boon to attacking type is detriment to defending type
      for (const row of typeDamage) {
        sumDEF -= getFXness(row.values[iType]);
      }
      stats.DEF[iType] = sumDEF;
      
      stats.TOTAL[iType] = sumATK + sumDEF;
    }
  
    return calcSTD(stats);
  };

  // Final slot gets std dev calculated from all preceding values
  const calcSTD = (stats) => {
    stats.ATK[18]   = STD(stats.ATK.slice(0, -1));
    stats.DEF[18]   = STD(stats.DEF.slice(0, -1));
    stats.TOTAL[18] = STD(stats.TOTAL.slice(0, -1));
    
    return stats;
  }

  // Deep copy srcTypeDamage; compare typeDamage to it to get diffCount
  const [typeDamage, setTypeDamage] = useState(JSON.parse(JSON.stringify(srcTypeDamage)));
  const [stats, setStats] = useState(calcStats(typeDamage));
  const [diffCount, setDiffCount] = useState(0);
  const fileUploadRef = useRef(null);

  // Update diffCount incrementally on click of single TypeTd
  const updateDiffCount = (rowIndex, colIndex, newValue) => {
    setDiffCount(diffCount + getDiffCountChange(rowIndex, colIndex, newValue));
  }

  const getDiffCountChange = (rowIndex, colIndex, newValue) => {
    const srcValue = srcTypeDamage[rowIndex].values[colIndex];
    const oldValue = typeDamage[rowIndex].values[colIndex];
    const wasChanged = (srcValue !== oldValue) ? 1 : 0;
    const isChanged  = (srcValue !== newValue) ? 1 : 0;
    return isChanged - wasChanged;
  }

  // Called on TypeTd click: updateStats and updateDiffCount before
  // setTypeDamage and prior value in typeDamage is overwritten
  const updateTypeDamage = (rowIndex, colIndex, newValue) => {
    updateStats(rowIndex, colIndex, newValue);

    updateDiffCount(rowIndex, colIndex, newValue);

    const newDamage = [...typeDamage];
    newDamage[rowIndex].values[colIndex] = newValue;
    setTypeDamage(newDamage);
  };

  // Compute newStats based on newValue being put in typeDamage[iATK][iDef]
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

  // Called by clearRow: For each type, carefully compute change
  // to its DEF stat. Set iATK type's ATK to 0 instantly
  function updateRowStats(iATK) {
    const newStats = {
      ATK:   [...stats.ATK],
      DEF:   [...stats.DEF],
      TOTAL: [...stats.TOTAL],
    };

    let changeSum = 0;
    for (let iDEF = 0; iDEF < 18; iDEF++) {
      const change = getFXness(typeDamage[iATK].values[iDEF]);

      // ie If Water (iATK) deals 2x to Fire (iDEF) prior, on row clear,
      // Water now deals 1x, so DEF & TOTAL of Fire rise by 1 
      newStats.DEF[iDEF]   += change;
      newStats.TOTAL[iDEF] += change;

      changeSum += change;
    }

    // Change's effect to ATK type's stat is reverse of that to DEF type's 
    newStats.ATK[iATK]  = 0;
    newStats.TOTAL[iATK] -= changeSum;

    setStats(calcSTD(newStats));
  }

  function updateColumnStats(iDEF) {
    const newStats = {
      ATK:   [...stats.ATK],
      DEF:   [...stats.DEF],
      TOTAL: [...stats.TOTAL],
    };

    let changeSum = 0;
    for (let iATK = 0; iATK < 18; iATK++) {
      const change = getFXness(typeDamage[iATK].values[iDEF]);
      newStats.ATK[iATK]   -= change;
      newStats.TOTAL[iATK] -= change;

      changeSum += change;
    }

    newStats.DEF[iDEF]  = 0;
    newStats.TOTAL[iDEF] += changeSum;

    setStats(calcSTD(newStats));
  }
  
  // Called by onDoubleClick of TypeTh that names row
  const clearRow = (rowIndex) => {
    // Update stats before prior values in typeDamage are overwritten
    updateRowStats(rowIndex);

    const newDamage = [...typeDamage];
    let rowDiffCount = 0;
    for (let colIndex = 0; colIndex < 18; colIndex++) {
      rowDiffCount += getDiffCountChange(rowIndex, colIndex, "");
      newDamage[rowIndex].values[colIndex] = "";
    }

    setDiffCount(diffCount + rowDiffCount);
    setTypeDamage(newDamage);
  };

  // Called by onDoubleClick of TypeTh that names column
  const clearColumn = (colIndex) => {
      updateColumnStats(colIndex);

      const newDamage = [...typeDamage];
      let colDiffCount = 0;
      for (let rowIndex = 0; rowIndex < 18; rowIndex++) {
        colDiffCount += getDiffCountChange(rowIndex, colIndex, "");
        newDamage[rowIndex].values[colIndex] = "";
      }
      setDiffCount(diffCount + colDiffCount);
      setTypeDamage(newDamage);
  }

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

  // Save work as .csv. Upload saved file to restore chart
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

  // Put uploaded data into typeDamage and show
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
        tdUpdate={updateTypeDamage} rowDBClick={clearRow} colDBClick={clearColumn} />
    <TypeDiffCount text="Changes : " title="Against official type chart" diffCount={diffCount} />
    <TypeStatsTable stats={stats} typeDamage = {typeDamage}/>
    <Footer author="Triet Lieu" link="https://github.com/ArceusX/pokemon-rebalance-types" />
  </div>
)
};

export default TypeRebalanceApp;
