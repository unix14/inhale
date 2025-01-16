import { useState, useEffect } from "react";
import { BreathingCircle } from "@/components/BreathingCircle";
import { IntervalSettings } from "@/components/IntervalSettings";
import { Button } from "@/components/ui/button";
import { Settings2, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

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
              setCurrentCycle(prev => prev + 1);
              breathingCycle();
            }, settings.exhaleTime * 1000);
          }, settings.holdTime * 1000);
        }, settings.inhaleTime * 1000);
      };

      breathingCycle();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isBreathing, settings]);

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
      <div className="fixed top-0 left-0 right-0 flex flex-col items-center pt-8 pb-4 bg-gradient-to-b from-breathing-dark to-transparent">
        <img src="/logo.svg" alt="Inhale.Lovable Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-2xl font-light text-white tracking-wider">Inhale.Lovable</h1>
      </div>

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
          <div className="mt-24">
            <BreathingCircle
              isBreathing={isBreathing}
              phase={phase}
              onLongPress={stopBreathing}
              onStart={startBreathing}
            />
          </div>
          {isBreathing && (
            <div className="mt-8 text-white text-lg animate-fade-in">
              Cycle {currentCycle}
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-md p-4">
          <Button
            variant="ghost"
            className="mb-8 text-white hover:text-breathing-accent absolute top-4 left-4"
            onClick={() => setShowSettings(false)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="mt-24">
            <IntervalSettings
              {...settings}
              onUpdate={handleSettingsUpdate}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;