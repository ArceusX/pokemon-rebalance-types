import React from 'react';

// Show value of stats[statKey][index]. Does not write data
function TypeTdStat({ stats, statKey, index, type, precision}) {

  const value = stats[statKey][index];
  const className = "dmg-perc-" + (value > 0 ? '200' : (value === 0 ? 'N' : '50'));

  return (
    <td id={`${statKey} ${type}`} className={className}>
      {precision !== undefined ? value.toFixed(precision) : value}
    </td>
  );
}

export default TypeTdStat;
