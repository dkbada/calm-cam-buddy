import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface StressMeterProps {
  stressLevel: number; // 0-100
}

export const StressMeter = ({ stressLevel }: StressMeterProps) => {
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayLevel(stressLevel), 100);
    return () => clearTimeout(timer);
  }, [stressLevel]);

  const getStressColor = (level: number) => {
    if (level < 30) return "hsl(150, 60%, 50%)"; // Low stress - green
    if (level < 60) return "hsl(45, 90%, 60%)"; // Medium stress - yellow
    return "hsl(0, 70%, 60%)"; // High stress - red
  };

  const getStressLabel = (level: number) => {
    if (level < 30) return "Calm & Focused";
    if (level < 60) return "Moderate";
    return "High Stress";
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (displayLevel / 100) * circumference;

  return (
    <Card className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-card to-accent/10 border-2 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Stress Level</h3>
      
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke={getStressColor(displayLevel)}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: getStressColor(displayLevel) }}>
            {displayLevel}%
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {getStressLabel(displayLevel)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">Real-time monitoring</p>
      </div>
    </Card>
  );
};
