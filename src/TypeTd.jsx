import React, { useCallback } from 'react';
import { DAMAGE_CLASS_MAP } from "./utils/TypeData.js";
import useTypeDamageStore from './utils/useTypeDamageStore.js';
import { getNextValue, } from "./utils/rebalance-util.js";

const TypeTd = React.memo(({ rowIndex, colIndex }) => {
  const value = useTypeDamageStore((state) => 
    state.typeDamage[rowIndex]?.values[colIndex] || ''
  );
  const type = useTypeDamageStore((state) => state.typeDamage[rowIndex]?.type);
  const defType = useTypeDamageStore((state) => state.typeDamage[colIndex]?.type);
  const updateCell = useTypeDamageStore((state) => state.updateCell);

  const handleClick = useCallback(() => {
    updateCell(rowIndex, colIndex, getNextValue(value));
  }, [rowIndex, colIndex, value, updateCell]);

  return (
    <td
      id={`${type}→${defType}`}
      className={DAMAGE_CLASS_MAP[value] || 'dmg-perc-'}
      onClick={handleClick}>
      {value}
    </td>
  );
});

export default TypeTd;