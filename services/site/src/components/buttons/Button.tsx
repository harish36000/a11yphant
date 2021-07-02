import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  icon?: React.ReactNode;
  srText?: string;
  overrideClassname?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({ full = false, icon, srText, className, overrideClassname = false, children, ...props }) => {
  return (
    <button
      className={clsx(
        className,
        full && "bg-primary text-white",
        !overrideClassname &&
          "inline-flex items-center px-4 py-2 border-primary border-2 rounded tracking-wider transition duration-300 hover:text-white hover:bg-primaryDark hover:border-primaryDark focus:text-white focus:bg-primaryDark focus:border-primaryDark",
      )}
      {...props}
    >
      {children}
      {icon}
      {srText && <span className="sr-only">{srText}</span>}
    </button>
  );
};

export default Button;
