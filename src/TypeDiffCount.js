import React from 'react';

const TypeDiffCount = ({text, diffCount}) => {
    return (
        <label id="diff-label" title="Against official type chart">
            {text}
            <span id="diff-show">{diffCount}</span>
        </label>
    );
};

export default TypeDiffCount;
