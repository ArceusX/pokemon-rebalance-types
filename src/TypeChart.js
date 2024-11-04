import React from 'react';
import TypeTh from './TypeTh';
import TypeTd from './TypeTd';

const TypeChart = ({ typeDamage, TdUpdate, rowDBClick, colDBClick }) => (
  <table id="type-chart">
  <thead>
    <tr id="type-chart-head">
      <TypeTh variant="key-table" />
      {typeDamage.map((row, rowIndex) => (
        <TypeTh key={rowIndex} index={rowIndex}
          type={row.type}
          title="Double-click to clear column"
          onDoubleClick={colDBClick} />
      ))}
    </tr>
  </thead>
  <tbody id="type-chart-body">
    {typeDamage.map((row, rowIndex) => (
      <tr key={rowIndex} id={row.type}>
        <TypeTh index={rowIndex}
          variant="icon-fu" type={row.type}
          title="Double-click to clear row"
          onDoubleClick={rowDBClick}
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
