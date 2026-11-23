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
  data: {
    month: string;
    opportunities: number;
    reservations: number;
    flightsBooked: number;
  }[];
}

export const ACTIVITY_SERIES = [
  { key: "opportunities", name: "Travel Opportunities", color: "#6d4df2" },
  { key: "reservations", name: "Reservation", color: "#2563eb" },
  { key: "flightsBooked", name: "Flights Booked (round trip)", color: "#f97316" },
] as const;

export default function DailyActivityChart({ data }: Props) {
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
            allowDecimals={false}
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
            dataKey="opportunities"
            name="Travel Opportunities"
            stroke="#6d4df2"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="reservations"
            name="Reservation"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          {/* শুধু বিন্দু, লাইন নেই (ছবির মতো) */}
          <Line
            type="monotone"
            dataKey="flightsBooked"
            name="Flights Booked"
            stroke="none"
            dot={{ r: 4, fill: "#f97316", stroke: "none" }}
            activeDot={{ r: 6, fill: "#f97316", stroke: "none" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}