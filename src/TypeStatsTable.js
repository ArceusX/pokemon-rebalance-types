import React from 'react';
import TypeTh from './TypeTh';
import TypeTdStat from './TypeTdStat';

const TypeStatsTable = ({ stats, typeDamage }) => (
  <table id="stats-table">
    <thead>
      <tr id="stats-head">
        <TypeTh variant="key-stats" />
        {typeDamage.map((row, index) => (
            <TypeTh key={index} variant="icon-fu" type={row.type} />
        ))}
        <TypeTh key="std-dev" variant="icon-fu"
            type="std-dev" title="Lower is better" />     
      </tr>
    </thead>
    <tbody>
    {['ATK', 'DEF', 'TOTAL'].map((statKey, statIndex) => (
      <tr key={statIndex} id={`stats-${statKey}`}>
        <TypeTh variant="icon-fu" type={statKey} />
        {typeDamage.map((row, index) => (
          <TypeTdStat key={index} 
              stats={stats} statKey={statKey} 
              index={index} type={row.name} />
        ))}
        <TypeTdStat
            index="18" stats={stats} statKey={statKey}
            type="std-dev" precision="2" />
      </tr>
    ))}
    </tbody>
  </table>
);

export default TypeStatsTable;
