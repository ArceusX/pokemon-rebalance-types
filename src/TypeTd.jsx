import React, { useCallback } from 'react';
import {DAMAGE_CLASS_MAP} from "./utils/TypeData.js";

const TypeTd = React.memo(({ typeDamage, rowIndex, colIndex, update }) => {
  const value = typeDamage[rowIndex]?.values[colIndex] || '';

  const handleClick = useCallback(() => {
    update(rowIndex, colIndex, getNextValue(value));
  }, [rowIndex, colIndex, value, update]);

  return (
    <td
      id={`${typeDamage[rowIndex]?.type}→${typeDamage[colIndex]?.type}`}
      className={DAMAGE_CLASS_MAP[value] || 'dmg-perc-'}
      onClick={handleClick}>
      {value}
    </td>
  );
}, (prevProps, nextProps) => {
  // Only re-render if this specific cell's value changed
  const prevValue = prevProps.typeDamage[prevProps.rowIndex]?.values[prevProps.colIndex];
  const nextValue = nextProps.typeDamage[nextProps.rowIndex]?.values[nextProps.colIndex];
  return prevValue === nextValue;
});

export default TypeTd;
