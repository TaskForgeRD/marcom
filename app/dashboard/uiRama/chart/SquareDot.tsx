import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SquareDot = ({ cx, cy, fill, index, data }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maxValue = Math.max(...data.map((d: any) => d.value));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maxIndex =
    maxValue > 0 ? data.findIndex((d: any) => d.value === maxValue) : -1;
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
