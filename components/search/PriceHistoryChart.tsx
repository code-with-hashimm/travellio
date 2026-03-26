"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  YAxis
} from "recharts";

interface PriceHistoryChartProps {
  data: number[];
  currentPrice: number;
}

export function PriceHistoryChart({ data, currentPrice }: PriceHistoryChartProps) {
  const lowestPrice = Math.min(...data);
  const isLowest = currentPrice <= lowestPrice;

  const chartData = data.map((price, i) => ({
    day: i + 1,
    price
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6b7280]">30-day price trend</span>
        {isLowest && (
          <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#16a34a]">
            Lowest in 30 days
          </span>
        )}
      </div>
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#033d4a" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#033d4a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={["dataMin - 500", "dataMax + 500"]} hide />
            <Tooltip
              contentStyle={{
                background: "#0d1117",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
                color: "#fff"
              }}
              formatter={(value: unknown) => [`₹${Number(value).toLocaleString("en-IN")}`, "Price"]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#033d4a"
              strokeWidth={2}
              fill="url(#priceFill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#00d4ff",
                stroke: "#033d4a",
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-[10px] text-[#6b7280]">
        <span>30 days ago</span>
        <span className="font-mono font-semibold text-accent-cyan">
          ₹{currentPrice.toLocaleString("en-IN")} today
        </span>
      </div>
    </div>
  );
}
