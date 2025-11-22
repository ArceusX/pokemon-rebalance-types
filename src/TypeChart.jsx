import React from 'react';
import { TypeTh, TypeTd } from "./";
import useTypeDamageStore from './utils/useTypeDamageStore.js';

// Pass typeDamage reference to TypeTh, TypeTd it creates
// Pass tdUpdate to allow changing one cell of typeDamage
// Pass rowDBClick to TypeTh row head, rowDBClick to TypeTh col head 

const TypeChart = React.memo(() => {
  const typeDamage = useTypeDamageStore((state) => state.typeDamage);
  const clearRow = useTypeDamageStore((state) => state.clearRow);
  const clearColumn = useTypeDamageStore((state) => state.clearColumn);

  return (
    <table id="type-chart">
      <thead>
        <tr id="type-chart-head">
          <TypeTh variant="key-table" />
          {typeDamage.map((row, rowIndex) => (
            <TypeTh 
              key={rowIndex} 
              index={rowIndex}
              type={row.type}
              title="Double-click to clear column"
              onDoubleClick={clearColumn} />
          ))}
        </tr>
      </thead>
      <tbody id="type-chart-body">
        {typeDamage.map((row, rowIndex) => (
          <tr key={rowIndex} id={row.type}>
            <TypeTh 
              index={rowIndex}
              variant="icon-fu" 
              type={row.type}
              title="Double-click to clear row"
              onDoubleClick={clearRow}
            />
            {row.values.map((_, colIndex) => (
              <TypeTd
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default TypeChart;
