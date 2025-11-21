import React from 'react';

const TypeDiffCount = ({ text, title, diffCount }) => (
  <label id="diff-label" title={title}>
    {text}
    <span id="diff-show">{diffCount}</span>
  </label>
);

export default TypeDiffCount;
