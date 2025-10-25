import { Card } from "@/components/ui/card";
import { Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const CameraStream = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-2 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Camera Monitor</h3>
        <Button
          variant="soft"
          size="sm"
          onClick={() => setIsEnabled(!isEnabled)}
        >
          {isEnabled ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
          {isEnabled ? "Enabled" : "Disabled"}
        </Button>
      </div>
      
      <div className="relative aspect-video bg-muted rounded-xl overflow-hidden flex items-center justify-center">
        {isEnabled ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <div className="text-center">
              <Video className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse-soft" />
              <p className="text-sm text-muted-foreground">Camera feed would appear here</p>
              <p className="text-xs text-muted-foreground mt-1">Real-time stress detection active</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <VideoOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Camera monitoring paused</p>
          </div>
        )}
      </div>
    </Card>
  );
};
