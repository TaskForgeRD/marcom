import React from "react";

export const SquareDot = ({ cx, cy, fill, index, data }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d.value));
  const maxIndex = maxValue > 0 ? data.findIndex((d: any) => d.value === maxValue) : -1;
  const isMax = index === maxIndex;
  const size = isMax ? 12 : 4;

  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      fill={fill}
      stroke="#fff"
      strokeWidth={1}
      rx={1}
    />
  );
};