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
  const [studyTime, setStudyTime] = useState(45);
  const [breakTime, setBreakTime] = useState(15);

  const [mode, setMode] = useState<Mode>("idle");
  const [studySeconds, setStudySeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [breaksCount, setBreaksCount] = useState(0);

  const [showSummary, setShowSummary] = useState(false);
  const [summaryStudySeconds, setSummaryStudySeconds] = useState(0);
  const [summaryBreakSeconds, setSummaryBreakSeconds] = useState(0);
  const [summaryBreaksCount, setSummaryBreaksCount] = useState(0);

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [stressLevel, setStressLevel] = useState(0);
  const [checkInInterval, setCheckInInterval] = useState(5); // seconds

  const [stressData, setStressData] = useState<{time:string, stress:number}[]>([]);

  const avgStress =
    stressData.length > 0
      ? Math.round(stressData.reduce((sum, entry) => sum + entry.stress, 0) / stressData.length)
      : 0;

  // --- Study / Break timers ---
  const handleTickStudy = () => setStudySeconds(prev => prev + 1);
  const handleTickBreak = () => setBreakSeconds(prev => prev + 1);
  const handleStartStudy = () => { setMode("study"); setBreakSeconds(0); };
  const handleStartBreak = () => { setMode("break"); setBreaksCount(prev => prev + 1); setBreakSeconds(0); };

  const encouragingMessages = [
    "You're doing amazing! Remember to breathe deeply and stay hydrated. 🌿",
    "Great focus! Don't forget to stretch your muscles every now and then. 💪",
    "You've got this! Taking regular breaks helps maintain your productivity. ✨",
    "Wonderful progress! Your dedication is inspiring. Keep up the great work! 🌟",
    "Remember: breaks aren't lazy, they're essential for your wellbeing! 🍃",
  ];
  
  const [currentMessage, setCurrentMessage] = useState(encouragingMessages[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Fetch live stress data ---
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/stress");
        const data = await res.json();
        const newStress = data.stress;
        setStressLevel(newStress);

        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
        setStressData(prev => [...prev, {time: timeStr, stress: newStress}].slice(-30)); // keep last 30 entries
      } catch (err) {
        console.error("Failed to fetch stress:", err);
      }
    }, checkInInterval * 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, checkInInterval]);

  const endSessionAndShowSummary = () => {
    setSummaryStudySeconds(studySeconds);
    setSummaryBreakSeconds(breakSeconds);
    setSummaryBreaksCount(breaksCount);
    setShowSummary(true);

    setMode("idle");
    setStudySeconds(0);
    setBreakSeconds(0);
    setBreaksCount(0);
    setIsMonitoring(false);
  };

  const handleToggleMonitoring = () => {
    if (isMonitoring) endSessionAndShowSummary();
    else { setIsMonitoring(true); setMode("study"); }
  };

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={{backgroundImage: `url(${calmBackground})`, backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed'}}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-3xl">🌱</span> Study Calm
              </h1>
              <p className="text-sm text-muted-foreground">Your mindful study companion</p>
            </div>
            <Button onClick={handleToggleMonitoring} size="lg" variant={isMonitoring ? "outline":"default"} className="gap-2">
              {isMonitoring ? <><Pause className="w-5 h-5" /> Pause Session</> : <><Play className="w-5 h-5" /> Resume Session</>}
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
              <EncouragingMessage message={currentMessage} />
              <CameraStream />
              <StressChart data={stressData} />
            </div>

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

      <SessionSummary
        open={showSummary}
        onOpenChange={setShowSummary}
        studyTimeSeconds={summaryStudySeconds}
        breakTimeSeconds={summaryBreakSeconds}
        breaksCount={summaryBreaksCount}
        avgStress={avgStress}
      />
    </div>
  );
};

export default Index;

