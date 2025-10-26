import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StressMeter } from "@/components/StressMeter";
import { TimeTracker } from "@/components/TimeTracker";
import { EncouragingMessage } from "@/components/EncouragingMessage";
import { CameraStream } from "@/components/CameraStream";
import { StressChart } from "@/components/StressChart";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionSummary } from "@/components/SessionSummary";
import { Play, Pause } from "lucide-react";
import calmBackground from "@/assets/calm-background.jpg";

type Mode = "idle" | "study" | "break";

const Index = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [studyTime, setStudyTime] = useState(45); // Mock data
  const [breakTime, setBreakTime] = useState(15); // Mock data
  const [stressLevel, setStressLevel] = useState(35);
  const [checkInInterval, setCheckInInterval] = useState(30);

    // --- study/break state that TimeTracker will control ---
  const [mode, setMode] = useState<Mode>("idle");
  const [studySeconds, setStudySeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [breaksCount, setBreaksCount] = useState(0);

  // --- summary modal state ---
  const [showSummary, setShowSummary] = useState(false);
  const [summaryStudySeconds, setSummaryStudySeconds] = useState(0);
  const [summaryBreakSeconds, setSummaryBreakSeconds] = useState(0);
  const [summaryBreaksCount, setSummaryBreaksCount] = useState(0);

  
  // Mock stress data for chart
  const [stressData, setStressData] = useState([
    { time: "10:00", stress: 20 },
    { time: "10:15", stress: 25 },
    { time: "10:30", stress: 35 },
    { time: "10:45", stress: 30 },
    { time: "11:00", stress: 40 },
    { time: "11:15", stress: 35 },
  ]);

      // --- ticking logic passed down into TimeTracker ---
  const handleTickStudy = () => {
    setStudySeconds((prev) => prev + 1);
  };

  const handleTickBreak = () => {
    setBreakSeconds((prev) => prev + 1);
  };

  // --- user presses "Start Study Session" in TimeTracker ---
  const handleStartStudy = () => {
    setMode("study");
    // optional: if you want starting study to reset break mode:
    setBreakSeconds(0);
  };

  // --- user presses "Start Break" in TimeTracker ---
  const handleStartBreak = () => {
    setMode("break");
    setBreaksCount((prev) => prev + 1);
    // optional: reset break timer for each break instead of cumulative:
    setBreakSeconds(0);
  };

  // --- when user ENDS the whole session (for example your Pause Session button) ---
  // this is where we:
  // 1. copy current times to summary*
  // 2. open summary modal
  // 3. reset timers back to zero
  const endSessionAndShowSummary = () => {
    // freeze current stats for the modal
    setSummaryStudySeconds(studySeconds);
    setSummaryBreakSeconds(breakSeconds);
    setSummaryBreaksCount(breaksCount);

    // show modal
    setShowSummary(true);

    // reset live counters for next session
    setMode("idle");
    setStudySeconds(0);
    setBreakSeconds(0);
    setBreaksCount(0);
  };

  // Encouraging messages that rotate
  const encouragingMessages = [
    "You're doing amazing! Remember to breathe deeply and stay hydrated. 🌿",
    "Great focus! Don't forget to stretch your muscles every now and then. 💪",
    "You've got this! Taking regular breaks helps maintain your productivity. ✨",
    "Wonderful progress! Your dedication is inspiring. Keep up the great work! 🌟",
    "Remember: breaks aren't lazy, they're essential for your wellbeing! 🍃",
  ];
  
  const [currentMessage, setCurrentMessage] = useState(encouragingMessages[0]);

  // Rotate encouraging messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]);
    }, 30000); // Change every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Simulate stress level changes when monitoring
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      setStressLevel(prev => {
        const change = Math.random() * 10 - 5; // Random change between -5 and +5
        const newLevel = Math.max(0, Math.min(100, prev + change));
        return Math.round(newLevel);
      });
      
      setStudyTime(prev => prev + 1);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      // Stopping monitoring - show summary
      setShowSummary(true);
    }
    setIsMonitoring(!isMonitoring);
  };

  const avgStress = Math.round(
    stressData.reduce((sum, point) => sum + point.stress, 0) / stressData.length
  );

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${calmBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="text-3xl">🌱</span>
                  Study Calm
                </h1>
                <p className="text-sm text-muted-foreground">Your mindful study companion</p>
              </div>
              
              <Button
                onClick={handleToggleMonitoring}
                size="lg"
                variant={isMonitoring ? "outline" : "default"}
                className="gap-2"
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause Session
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Resume Session
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stress Meter and Time Tracker Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StressMeter stressLevel={stressLevel} />
                <TimeTracker
                  mode={mode}
                  studySeconds={studySeconds}
                  breakSeconds={breakSeconds}
                  breaksCount={breaksCount}
                  onTickStudy={handleTickStudy}
                  onTickBreak={handleTickBreak}
                  onStartStudy={handleStartStudy}
                  onStartBreak={handleStartBreak}
                />
              </div>

              {/* Encouraging Message */}
              <EncouragingMessage message={currentMessage} />

              {/* Camera Stream */}
              <CameraStream />

              {/* Stress Chart */}
              <StressChart data={stressData} />
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              <SettingsPanel
                isMonitoring={isMonitoring}
                onToggleMonitoring={handleToggleMonitoring}
                checkInInterval={checkInInterval}
                onChangeInterval={setCheckInInterval}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Session Summary Dialog */}
      <SessionSummary
        open={showSummary}
        onOpenChange={setShowSummary}
        studyTimeSeconds={summaryStudySeconds}
        studyTime={studyTime}
        breakTimeSeconds={summaryBreakSeconds}
        breaksCount={summaryBreaksCount}
        avgStress={avgStress}
      />
    </div>
  );
};

export default Index;
