import { Card } from "@/components/ui/card";
import { Clock, Coffee } from "lucide-react";

interface TimeTrackerProps {
  studyTime: number; // in minutes
  breakTime: number; // in minutes
  breaksCount: number;
}

export const TimeTracker = ({ studyTime, breakTime, breaksCount }: TimeTrackerProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/30 to-accent/20 border-2 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Session Stats</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Time</p>
              <p className="text-2xl font-bold text-foreground">{formatTime(studyTime)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Coffee className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Breaks Taken</p>
              <p className="text-2xl font-bold text-foreground">{breaksCount}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold text-accent-foreground">{formatTime(breakTime)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
