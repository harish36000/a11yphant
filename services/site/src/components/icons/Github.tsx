import clsx from "clsx";
import React from "react";

const Github: React.FunctionComponent = () => {
  return (
    <svg className={clsx("h-full w-full text-gray-300")} fill="currentColor" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.327 9C14.964 9 9 14.964 9 22.327c0 5.89 3.82 10.88 9.114 12.648.662.123.908-.286.908-.646 0-.32-.008-1.154-.016-2.266-3.707.801-4.492-1.784-4.492-1.784-.605-1.538-1.48-1.955-1.48-1.955-1.212-.827.09-.81.09-.81 1.333.098 2.045 1.374 2.045 1.374 1.186 2.037 3.117 1.448 3.877 1.105.123-.86.467-1.448.843-1.784-2.953-.327-6.062-1.472-6.062-6.577 0-1.457.515-2.643 1.374-3.576-.139-.343-.597-1.693.123-3.526 0 0 1.12-.36 3.665 1.367 1.064-.295 2.2-.442 3.338-.45 1.129.008 2.274.155 3.338.45 2.544-1.726 3.665-1.367 3.665-1.367.728 1.833.27 3.191.131 3.527.85.932 1.366 2.118 1.366 3.575 0 5.121-3.117 6.242-6.087 6.577.475.41.909 1.227.909 2.47 0 1.784-.017 3.216-.017 3.658 0 .36.237.769.916.638 5.294-1.767 9.106-6.758 9.106-12.64C35.654 14.964 29.69 9 22.327 9z"
      />
    </svg>
  );
};

export default Github;
