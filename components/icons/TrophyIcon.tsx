
import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9a9.75 9.75 0 011.01-4.826A5.969 5.969 0 0112 11.25a5.969 5.969 0 013.49 2.674 9.75 9.75 0 011.01 4.826zM12 11.25a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5zM3 18.75a9.75 9.75 0 0118 0"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 21.75h4.5a2.25 2.25 0 002.25-2.25V15M4.125 15.375A2.25 2.25 0 016.375 13.5h11.25a2.25 2.25 0 012.25 2.25v4.125M3 3.75l3 3m12-3l-3 3"
    />
  </svg>
);
