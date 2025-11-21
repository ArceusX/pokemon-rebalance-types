import {useState, useRef, useMemo, useCallback, } from 'react';
import {
  TypeChart, TypeDiffCount, TypeStatsTable, Footer,
} from "./";

import { TYPE_DAMAGE, TYPE_COUNT, } from "./utils/TypeData.js"
import { calcStats,  } from './utils/rebalance-util.js';
import appConfig from './utils/appConfig.js';

const TypeRebalance = ({ data = TYPE_DAMAGE } = {}) => {
  const srcTypeDamage = useMemo(() => JSON.parse(JSON.stringify(data)), []);
  const [typeDamage, setTypeDamage] = useState(() => JSON.parse(JSON.stringify(data)));
  const [diffCount, setDiffCount] = useState(0);
  const fileUploadRef = useRef(null);

  // Memoized stats calculation - only recalculates when typeDamage changes
  const stats = useMemo(() => calcStats(typeDamage), [typeDamage]);

  // Memoized update function
  const updateTypeDamage = useCallback((rowIndex, colIndex, newValue) => {
    setTypeDamage(prevDamage => {
      const newDamage = prevDamage.map((row, idx) => 
        idx === rowIndex 
          ? { ...row, values: [...row.values] }
          : row
      );
      newDamage[rowIndex].values[colIndex] = newValue;
      return newDamage;
    });

    setDiffCount(prevCount => {
      const srcValue = srcTypeDamage[rowIndex].values[colIndex];
      const oldValue = typeDamage[rowIndex].values[colIndex];
      const wasChanged = srcValue !== oldValue ? 1 : 0;
      const isChanged = srcValue !== newValue ? 1 : 0;
      return prevCount + (isChanged - wasChanged);
    });
  }, [srcTypeDamage, typeDamage]);

  const clearRow = useCallback((rowIndex) => {
    setTypeDamage(prevDamage => {
      const newDamage = [...prevDamage];
      newDamage[rowIndex] = {
        ...newDamage[rowIndex],
        values: new Array(TYPE_COUNT).fill("")
      };
      return newDamage;
    });

    setDiffCount(prevCount => {
      let rowDiffCount = 0;
      for (let colIndex = 0; colIndex < TYPE_COUNT; colIndex++) {
        const srcValue = srcTypeDamage[rowIndex].values[colIndex];
        const oldValue = typeDamage[rowIndex].values[colIndex];
        const wasChanged = srcValue !== oldValue ? 1 : 0;
        const isChanged = srcValue !== "" ? 1 : 0;
        rowDiffCount += isChanged - wasChanged;
      }
      return prevCount + rowDiffCount;
    });
  }, [srcTypeDamage, typeDamage]);

  const clearColumn = useCallback((colIndex) => {
    setTypeDamage(prevDamage => 
      prevDamage.map(row => ({
        ...row,
        values: row.values.map((val, idx) => idx === colIndex ? "" : val)
      }))
    );

    setDiffCount(prevCount => {
      let colDiffCount = 0;
      for (let rowIndex = 0; rowIndex < TYPE_COUNT; rowIndex++) {
        const srcValue = srcTypeDamage[rowIndex].values[colIndex];
        const oldValue = typeDamage[rowIndex].values[colIndex];
        const wasChanged = srcValue !== oldValue ? 1 : 0;
        const isChanged = srcValue !== "" ? 1 : 0;
        colDiffCount += isChanged - wasChanged;
      }
      return prevCount + colDiffCount;
    });
  }, [srcTypeDamage, typeDamage]);

  const clearChart = useCallback(() => {
    setTypeDamage(typeDamage.map(row => ({
      type: row.type,
      values: new Array(row.values.length).fill("")
    })));
    setDiffCount(120);
  }, []);

  const downloadChart = useCallback(() => {
    const now = new Date().toLocaleString();
    let content = `Pokémon Type Rebalancing — ${now}\n\n`;
    
    for (let rowIndex = 0; rowIndex < TYPE_COUNT; rowIndex++) {
      content += typeDamage[rowIndex].values.join(',') + '\n';
    }

    const blob = new Blob([content], { type: 'text/csv; charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "typechart.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [typeDamage]);

  const handleUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n').slice(2);
      const data = lines.map(line => line.split(','));

      const newDamage = typeDamage.map((row, rowIndex) => ({
        ...row,
        values: row.values.map((_, colIndex) => data[rowIndex]?.[colIndex] || "")
      }));

      let newDiffCount = 0;
      for (let rowIndex = 0; rowIndex < TYPE_COUNT; rowIndex++) {
        for (let colIndex = 0; colIndex < TYPE_COUNT; colIndex++) {
          const value = newDamage[rowIndex].values[colIndex];
          if (value !== srcTypeDamage[rowIndex].values[colIndex]) {
            newDiffCount++;
          }
        }
      }

      setTypeDamage(newDamage);
      setDiffCount(newDiffCount);
    };
    reader.readAsText(file);
  }, [typeDamage, srcTypeDamage]);

  return (
    <div id="type-rebalance-app">
      <h2 id="title">{appConfig.meta.appName}</h2>
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

      <TypeChart 
        typeDamage={typeDamage}
        tdUpdate={updateTypeDamage} 
        rowDBClick={clearRow} 
        colDBClick={clearColumn} 
      />
      <TypeDiffCount 
        text="Changes : " 
        title="Against official type chart" 
        diffCount={diffCount} 
      />
      <TypeStatsTable stats={stats} typeDamage={typeDamage} />
      <Footer data={appConfig} />
    </div>
  );
};

export default TypeRebalance;
