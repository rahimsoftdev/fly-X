import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

interface Props {
  data: { month: string; total: number }[];
}

const formatTick = (v: number) =>
  v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : String(v);

export default function MembersOverTimeChart({ data }: Props) {
  return (
    <div className="h-64 w-full text-gray-400 dark:text-slate-500">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "currentColor" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={formatTick}
            tick={{ fontSize: 10, fill: "currentColor" }}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{
              stroke: "currentColor",
              strokeDasharray: "3 3",
              strokeOpacity: 0.5,
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Members"
            stroke="#5b3fe4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}