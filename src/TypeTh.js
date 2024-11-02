import React from 'react';

// key(-table, -stats)  variants return preset content
// For type="Fire", variant= ...
// icon-fu: <th><a class="icon-fu type-fire">Fire</a></th>
// default: <th><a class="type-fire">Fir</a></th>

const TypeTh = ({variant, type, title, onDoubleClick }) => {
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
        <th onDoubleClick={onDoubleClick}>
          <a
            className={`icon-fu type-${type.toLowerCase()}`}
            title={title}
            onDoubleClick={onDoubleClick}
            href="/" >
            {type.toUpperCase()}
          </a>
        </th>
      );
    default:
      return (
        <th>
          <a className={`type-${type.toLowerCase()}`}
            title={title}
            onDoubleClick={onDoubleClick}
            href="/" >
            {type.slice(0, 3).toUpperCase()}
          </a>
        </th>
      );
  }
};

export default TypeTh;