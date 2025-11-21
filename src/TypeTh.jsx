import { React, useCallback, } from 'react';


// key(-table, -stats) variants return preset content
// For type="Fire", variant= ...
// icon-fu: <div class="icon-fu type-fire">Fire</div>
// default: <div class="type-fire">Fir</div>

const TypeTh = ({ variant, type, index, title, onDoubleClick }) => {
  const handleDoubleClick = useCallback(() => {
    onDoubleClick?.(index);
  }, [index, onDoubleClick]);

  switch (variant) {
    case 'key-table':
      return (
        <th className="tiny-text">
          DEFENCE&nbsp;→<br />
          ATTACK&nbsp;↓
        </th>
      );
    case 'key-stats':
      return (
        <th className="tiny-text">
          TYPE&nbsp;→<br />
          STAT&nbsp;↓
        </th>
      );
    case 'icon-fu':
      return (
        <th>
          <div
            className={`icon-fu type-${type.toLowerCase()}`}
            title={title}
            onDoubleClick={handleDoubleClick}>
            {type.toUpperCase()}
          </div>
        </th>
      );
    default:
      return (
        <th>
          <div 
            className={`type-${type.toLowerCase()}`}
            title={title}
            onDoubleClick={handleDoubleClick}>
            {type.slice(0, 3).toUpperCase()}
          </div>
        </th>
      );
  }
};

export default TypeTh;