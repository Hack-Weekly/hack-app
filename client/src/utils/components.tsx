import React, { FC } from "react";

export const HFlex: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );
};

export const VFlex: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );
};
