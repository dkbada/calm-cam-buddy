import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface StressDataPoint {
  time: string;
  stress: number;
}

interface StressChartProps {
  data: StressDataPoint[];
}

export const StressChart = ({ data }: StressChartProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-2 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Stress Over Time</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(150, 40%, 55%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(150, 40%, 55%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 25%, 88%)" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(150, 15%, 45%)"
            tick={{ fill: 'hsl(150, 15%, 45%)' }}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(150, 15%, 45%)"
            tick={{ fill: 'hsl(150, 15%, 45%)' }}
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(0, 0%, 100%)',
              border: '2px solid hsl(150, 25%, 88%)',
              borderRadius: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: 'hsl(150, 40%, 15%)', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="stress"
            stroke="hsl(150, 40%, 55%)"
            strokeWidth={3}
            fill="url(#stressGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Stress Level</span>
        </div>
      </div>
    </Card>
  );
};
