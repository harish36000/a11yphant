import React from "react";

const DifficultyMedium: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      viewBox="0 0 25 15"
      fill="currentColor"
      stroke="currentColor"
      className={`${className} text-primary`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="7" height="15" rx="2" />
      <rect x="9" width="7" height="15" rx="2" />
      <rect x="18.5" y=".5" width="6" height="14" rx="1.5" />
    </svg>
  );
};

export default DifficultyMedium;
