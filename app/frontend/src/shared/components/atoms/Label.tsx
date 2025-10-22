import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = (props) => (
  <label
    className="block mb-1 text-text-secondary font-medium text-sm sm:text-base"
    {...props}
  />
);
