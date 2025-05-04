import React from "react";

const LeftRightPadding = ({ children }: { children?: React.ReactNode }) => {
  return <div className="px-2 md:px-6 xl:px-10 max-w-full ">{children}</div>;
};

export default LeftRightPadding;
