import React from 'react';

// key(-table, -stats)  variants return preset content
// For type="Fire", variant= ...
// icon-fu: <th><div class="icon-fu type-fire">Fire</div></th>
// default: <th><div class="type-fire">Fir</div></th>

const TypeTh = ({variant, type, index, title, onDoubleClick }) => {
  switch (variant) {
    case 'key-table':
      return (
        <th className="tiny-text">
          DEFENCE&nbsp;&#8594;<br />
          ATTACK&nbsp;&#x2193;
        </th>
      );
    case 'key-stats':
      return (
        <th className="tiny-text">
          TYPE&nbsp;&#8594;<br />
          STAT&nbsp;&#x2193;
        </th>
      );
    case 'icon-fu':
      return (
        <th>
          <div
            className={`icon-fu type-${type.toLowerCase()}`}
            title={title}
            onDoubleClick={() => onDoubleClick(index)}
          >
            {type.toUpperCase()}
          </div>
        </th>
      );
    default:
      return (
        <th>
          <div className={`type-${type.toLowerCase()}`}
            title={title}
            onDoubleClick={() => onDoubleClick(index)}
          >
            {type.slice(0, 3).toUpperCase()}
          </div>
        </th>
      );
  }
};

export default TypeTh;