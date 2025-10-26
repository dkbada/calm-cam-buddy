import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Coffee, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mode = "idle" | "study" | "break";

interface TimeTrackerProps {
  mode: Mode;
  studySeconds: number;
  breakSeconds: number;
  breaksCount: number;
  onTickStudy: () => void;
  onTickBreak: () => void;
  onStartStudy: () => void;
  onStartBreak: () => void;
}

export const TimeTracker = ({
  mode,
  studySeconds,
  breakSeconds,
  breaksCount,
  onTickStudy,
  onTickBreak,
  onStartStudy,
  onStartBreak,
}: TimeTrackerProps) => {
  const formatHMS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  };

  // Drive ticking by asking the parent to increment
  useEffect(() => {
    let interval: number | undefined;

    if (mode === "study") {
      interval = window.setInterval(() => {
        onTickStudy();
      }, 1000);
    } else if (mode === "break") {
      interval = window.setInterval(() => {
        onTickBreak();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, onTickStudy, onTickBreak]);

  const canStartStudy = mode !== "study";
  const canStartBreak = mode === "study";

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/30 to-accent/20 border-2 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Session Stats</h3>

      {/* Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={onStartStudy}
          disabled={!canStartStudy}
          className="flex-1 flex items-center justify-center gap-2"
          variant={canStartStudy ? "default" : "outline"}
        >
          <Play className="w-4 h-4" />
          <span>Start Study Session</span>
        </Button>

        <Button
          onClick={onStartBreak}
          disabled={!canStartBreak}
          className="flex-1 flex items-center justify-center gap-2"
          variant={canStartBreak ? "secondary" : "outline"}
        >
          <Pause className="w-4 h-4" />
          <span>Start Break</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        {/* Study Time */}
        <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Study Time{" "}
                {mode === "study" && (
                  <span className="text-xs text-primary">(live)</span>
                )}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatHMS(studySeconds)}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {mode === "study"
              ? "Studying now"
              : mode === "break"
              ? "On break"
              : "Idle"}
          </div>
        </div>

        {/* Break Info */}
        <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Coffee className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Breaks Taken</p>
              <p className="text-2xl font-bold text-foreground">
                {breaksCount}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
              Break Time{" "}
              {mode === "break" && (
                <span className="text-xs text-primary">(live)</span>
              )}
            </p>
            <p className="text-lg font-semibold text-accent-foreground">
              {formatHMS(breakSeconds)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
