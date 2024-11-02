import React from 'react';

const evalClass = (value) => {
  switch (value) {
    case '2':
      return 'dmg-perc-200';
    case '½':
      return 'dmg-perc-50';
    case '0':
      return 'dmg-perc-0';
    default:
      return 'dmg-perc-';
  }
};

const TypeTd = ({ typeDamage, rowIndex, colIndex, update }) => {
  const value = typeDamage[rowIndex].values[colIndex];

  const getNextValue = (currentValue) => {
    switch (currentValue) {
      case '0':
        return '½';
      case '½':
        return '';
      case '':
        return '2';
      case '2':
        return '0';
      default:
        return currentValue;
    }
  };

  const handleClick = () => {
    update(rowIndex, colIndex, getNextValue(value))
  }

  return (
    <td
      id={`${typeDamage[rowIndex].type}→${typeDamage[colIndex].type}`}
      className={evalClass(value)}
      onClick={handleClick}>
      {value}
    </td>
  );
};

export default TypeTd;