import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell } from "lucide-react";

interface SettingsPanelProps {
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  checkInInterval: number;
  onChangeInterval: (minutes: number) => void;
}

export const SettingsPanel = ({
  isMonitoring,
  onToggleMonitoring,
  checkInInterval,
  onChangeInterval,
}: SettingsPanelProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/20 to-card border-2 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Settings</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <Label htmlFor="monitoring" className="text-sm font-medium">
                Active Monitoring
              </Label>
              <p className="text-xs text-muted-foreground">Track stress in real-time</p>
            </div>
          </div>
          <Switch
            id="monitoring"
            checked={isMonitoring}
            onCheckedChange={onToggleMonitoring}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Break Reminder Interval</Label>
          <Select
            value={checkInInterval.toString()}
            onValueChange={(value) => onChangeInterval(parseInt(value))}
          >
            <SelectTrigger className="w-full bg-card border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Every 15 minutes</SelectItem>
              <SelectItem value="30">Every 30 minutes</SelectItem>
              <SelectItem value="45">Every 45 minutes</SelectItem>
              <SelectItem value="60">Every 60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!isMonitoring && (
          <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 animate-fade-in">
            <p className="text-sm text-accent-foreground">
              💤 Monitoring is paused. Your session summary will be available when you're ready!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
