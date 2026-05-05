import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface LogicRadarChartProps {
  dnaString?: string;
  parsedData?: Record<string, number>;
}

export function LogicRadarChart({ parsedData }: LogicRadarChartProps) {
  // Transform the JSON object { "Efficiency": 8, "Security": 6 } into Recharts format
  const chartData = Object.entries(parsedData || {}).map(([key, value]) => ({
    subject: key,
    score: value,
    fullMark: 10, // Assuming AI scores out of 10
  }));

  if (chartData.length === 0) {
    return <div className="text-slate-400">Invalid Data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="#e2e8f0" />
        
        {/* The labels around the outside (Efficiency, Security, etc.) */}
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} 
        />
        
        {/* Hides the ugly inner numbers (0, 2, 4, 6) but keeps the scale proportional to 10 */}
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
        
        {/* The actual colored shape */}
        <Radar
          name="Candidate Score"
          dataKey="score"
          stroke="#0f172a"
          strokeWidth={2}
          fill="#3b82f6"
          fillOpacity={0.4}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}