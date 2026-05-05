import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  dnaString: string;
}

export const LogicRadarChart = ({ dnaString }: Props) => {
  // Parse the JSON string from the backend
  const rawData = JSON.parse(dnaString || "{}");
  
  // Transform to Recharts format
  const chartData = Object.entries(rawData).map(([trait, score]) => ({
    trait,
    score,
  }));

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          AI Logic DNA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid strokeOpacity={0.1} />
              <PolarAngleAxis 
                dataKey="trait" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} 
              />
              <Radar
                name="Candidate"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};