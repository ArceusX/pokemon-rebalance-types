import { useRef, useMemo } from 'react';
import {
  TypeChart, TypeDiffCount, TypeStatsTable, Footer,
} from "./";
import { calcStats } from './utils/rebalance-util.js';
import appConfig from './utils/appConfig.js';
import useTypeDamageStore from './utils/useTypeDamageStore.js';

const TypeRebalance = () => {
  const fileUploadRef = useRef(null);
  
  // Get state and actions from store
  const typeDamage = useTypeDamageStore((state) => state.typeDamage);
  const diffCount = useTypeDamageStore((state) => state.diffCount);
  const clearAll = useTypeDamageStore((state) => state.clearAll);
  const uploadChart = useTypeDamageStore((state) => state.uploadChart);

  // Keep stats as memoized value - only used by TypeStatsTable
  const stats = useMemo(() => calcStats(typeDamage), [typeDamage]);

  const downloadChart = () => {
    const now = new Date().toLocaleString();
    let content = `Pokémon Type Rebalancing — ${now}\n\n`;
    
    for (let rowIndex = 0; rowIndex < typeDamage.length; rowIndex++) {
      content += typeDamage[rowIndex].values.join(',') + '\n';
    }

    const blob = new Blob([content], { type: 'text/csv; charset=utf-8;' });
    const link = document.createElement('a');
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
    reader.onload = (e) => uploadChart(e.target.result);
    reader.readAsText(file);
  };

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
        <button id="btn-clear" onClick={clearAll}>Clear All</button>
        <button id="btn-download" onClick={downloadChart}>Download</button>
      </div>

      <TypeChart />
      <TypeDiffCount 
        text="Changes : " 
        title="Against official type chart" 
        diffCount={diffCount} 
      />
      <TypeStatsTable stats={stats} />
      <Footer data={appConfig} />
    </div>
  );
};

export default TypeRebalance;