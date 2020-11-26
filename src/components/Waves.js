import React from 'react';
import PropTypes from 'prop-types';

function Waves({ theme = 'light' }) {
  const color = theme == 'light' ? '255,241,232' : '31,37,61';

  return (
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="0"
          fill={`rgba(${color},0.7)`}
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="3"
          fill={`rgba(${color},0.5)`}
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="5"
          fill={`rgba(${color},0.3)`}
        />
        <use xlinkHref="#gentle-wave" x="48" y="7" fill={`rgba(${color},1)`} />
      </g>
    </svg>
  );
}

export default Waves;
