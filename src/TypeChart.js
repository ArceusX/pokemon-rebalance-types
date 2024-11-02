import React from 'react';
import TypeTh from './TypeTh';
import TypeTd from './TypeTd';

const TypeChart = ({ typeDamage, TdUpdate, ThOnDoubleClick }) => (
  <table id="type-chart">
  <thead>
    <tr id="type-chart-head">
      <TypeTh variant="key-table" />
      {typeDamage.map((row, index) => (
        <TypeTh key={index} type={row.type} />
      ))}
    </tr>
  </thead>
  <tbody id="type-chart-body">
    {typeDamage.map((row, rowIndex) => (
      <tr key={rowIndex} id={row.type}>
        <TypeTh
          type={row.type} variant="icon-fu"
          title="Double-click to clear row"
          onDoubleClick={() => ThOnDoubleClick(rowIndex)}
        />
        {row.values.map((_, colIndex) => (
          <TypeTd
            key={`${rowIndex}-${colIndex}`}
            typeDamage={typeDamage}
            rowIndex={rowIndex}
            colIndex={colIndex}
            update={TdUpdate}
          />
        ))}
      </tr>
    ))}
  </tbody>
</table>
);

export default TypeChart;
