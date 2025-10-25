import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import cutePlant from "@/assets/cute-plant.png";

interface EncouragingMessageProps {
  message: string;
}

export const EncouragingMessage = ({ message }: EncouragingMessageProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-accent/20 to-secondary/30 border-2 border-accent/30 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 animate-gentle-bounce">
          <img src={cutePlant} alt="Encouraging buddy" className="w-16 h-16 drop-shadow-md" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
            <h3 className="text-sm font-semibold text-primary">Keep Going!</h3>
          </div>
          <p className="text-foreground leading-relaxed">{message}</p>
        </div>
      </div>
    </Card>
  );
};
