import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Coffee, TrendingDown, Heart } from "lucide-react";
import cutePlant from "@/assets/cute-plant.png";

interface SessionSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studyTime: number;
  breaksCount: number;
  avgStress: number;
}

export const SessionSummary = ({
  open,
  onOpenChange,
  studyTime,
  breaksCount,
  avgStress,
}: SessionSummaryProps) => {
  const getStressMessage = (stress: number) => {
    if (stress < 30) return "You stayed wonderfully calm throughout your session! 🌟";
    if (stress < 60) return "You managed stress well today. Keep it up! 💪";
    return "You worked hard! Remember to take care of yourself. 💚";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background to-accent/10 border-2 border-primary/20">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <img src={cutePlant} alt="Session complete" className="w-20 h-20 animate-gentle-bounce" />
          </div>
          <DialogTitle className="text-2xl text-center">Session Complete! 🎉</DialogTitle>
          <DialogDescription className="text-center text-base">
            Here's how your study session went
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card rounded-xl border-2 border-border text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{formatTime(studyTime)}</p>
              <p className="text-xs text-muted-foreground">Studied</p>
            </div>
            
            <div className="p-4 bg-card rounded-xl border-2 border-border text-center">
              <Coffee className="w-6 h-6 text-accent-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{breaksCount}</p>
              <p className="text-xs text-muted-foreground">Breaks</p>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-xl border-2 border-border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              <p className="font-semibold text-foreground">Average Stress: {avgStress}%</p>
            </div>
            <p className="text-sm text-muted-foreground">{getStressMessage(avgStress)}</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Great job today!</p>
                <p className="text-sm text-muted-foreground">
                  {breaksCount > 2 
                    ? "Excellent work taking breaks regularly! Your body and mind thank you. 💚" 
                    : breaksCount > 0
                    ? "Good start with breaks! Try to take more next time for optimal focus. 🌱"
                    : "Remember to take breaks next time! They help you stay focused and calm. ✨"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => onOpenChange(false)} className="flex-1" size="lg">
            Start New Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
