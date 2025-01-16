import { useState, useEffect } from "react";
import { BreathingCircle } from "@/components/BreathingCircle";
import { IntervalSettings } from "@/components/IntervalSettings";
import { Button } from "@/components/ui/button";
import { Settings2, ArrowLeft } from "lucide-react";

const Index = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [settings, setSettings] = useState({
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    cycles: 5,
  });
  const [currentCycle, setCurrentCycle] = useState(1);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isBreathing) {
      const breathingCycle = () => {
        // Inhale phase
        setPhase("inhale");
        timer = setTimeout(() => {
          // Hold phase
          setPhase("hold");
          timer = setTimeout(() => {
            // Exhale phase
            setPhase("exhale");
            timer = setTimeout(() => {
              if (currentCycle < settings.cycles) {
                setCurrentCycle(prev => prev + 1);
                breathingCycle();
              } else {
                stopBreathing();
              }
            }, settings.exhaleTime * 1000);
          }, settings.holdTime * 1000);
        }, settings.inhaleTime * 1000);
      };

      breathingCycle();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isBreathing, currentCycle, settings]);

  const startBreathing = () => {
    setIsBreathing(true);
    setCurrentCycle(1);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setPhase("idle");
    setCurrentCycle(1);
  };

  const handleSettingsUpdate = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-breathing-dark flex flex-col items-center justify-center p-4">
      {!showSettings ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-breathing-accent"
            onClick={() => setShowSettings(true)}
          >
            <Settings2 className="h-6 w-6" />
          </Button>
          <BreathingCircle
            isBreathing={isBreathing}
            phase={phase}
            onLongPress={stopBreathing}
            onStart={startBreathing}
          />
          {isBreathing && (
            <div className="mt-8 text-white text-lg animate-fade-in">
              Cycle {currentCycle} of {settings.cycles}
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-md p-4">
          <Button
            variant="ghost"
            className="mb-8 text-white hover:text-breathing-accent"
            onClick={() => setShowSettings(false)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <IntervalSettings
            {...settings}
            onUpdate={handleSettingsUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default Index;