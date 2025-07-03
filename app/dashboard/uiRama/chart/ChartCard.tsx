import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { SquareDot } from "./SquareDot";
import { ActiveSquareDot } from "./ActiveSquareDot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  value: number;
  data: Array<{ name: string; value: number }>;
  color: string;
  subtitle?: string | null;
}

export function ChartCard({
  title,
  value,
  data,
  color,
  subtitle = null,
}: ChartCardProps) {
  return (
    <Card className="w-full h-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">
              {title}
              {subtitle && (
                <span className="text-gray-500 text-sm font-normal">
                  {" "}
                  ({subtitle})
                </span>
              )}
            </CardTitle>
          </div>
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${color}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="85%" stopColor={color} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} horizontal stroke="#f5f5f5" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                axisLine={{ stroke: color, strokeWidth: 1 }}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  padding: "8px",
                }}
                itemStyle={{ color: color, fontWeight: 500 }}
                formatter={(value) => [`${value}`, ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                strokeWidth={2}
                fill={`url(#gradient-${color})`}
                dot={(dotProps) => {
                  const { key, ...rest } = dotProps;
                  return (
                    <SquareDot key={key} {...rest} data={data} fill={color} />
                  );
                }}
                activeDot={(dotProps) => {
                  const { key, ...rest } = dotProps;
                  return (
                    <ActiveSquareDot
                      key={key}
                      {...rest}
                      data={data}
                      fill={color}
                    />
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
