import { useState, useEffect } from "react";
import { BreathingCircle } from "@/components/BreathingCircle";
import { IntervalSettings } from "@/components/IntervalSettings";
import { Button } from "@/components/ui/button";
import { Settings2, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { audioManager } from "@/utils/audioUtils";

const Index = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [settings, setSettings] = useState({
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
  });

  useEffect(() => {
    // Load audio files when the component mounts
    const loadAudio = async () => {
      await audioManager.loadSound('inhale', '/sounds/inhale.mp3');
      await audioManager.loadSound('hold', '/sounds/hold.mp3');
      await audioManager.loadSound('exhale', '/sounds/exhale.mp3');
      await audioManager.loadSound('complete', '/sounds/complete.mp3');
    };
    loadAudio();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isBreathing) {
      const breathingCycle = () => {
        setPhase("inhale");
        audioManager.playSound('inhale');
        
        timer = setTimeout(() => {
          setPhase("hold");
          audioManager.playSound('hold');
          
          timer = setTimeout(() => {
            setPhase("exhale");
            audioManager.playSound('exhale');
            
            timer = setTimeout(() => {
              audioManager.playSound('complete');
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
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setPhase("idle");
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
          <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 pt-8 pb-4 bg-gradient-to-b from-breathing-dark to-transparent">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Inhale.Lovable Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-light text-white tracking-wider">Inhale.Lovable</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-breathing-accent hover:bg-breathing-dark/50"
              onClick={() => setShowSettings(true)}
            >
              <Settings2 className="h-6 w-6" />
            </Button>
          </div>
          <div className="mt-24">
            <BreathingCircle
              isBreathing={isBreathing}
              phase={phase}
              onLongPress={stopBreathing}
              onStart={startBreathing}
            />
          </div>
        </>
      ) : (
        <div className="w-full max-w-md p-4">
          <Button
            variant="ghost"
            className="fixed top-4 left-4 z-50 text-white hover:text-breathing-accent hover:bg-breathing-dark/50"
            onClick={() => setShowSettings(false)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <ScrollArea className="h-[calc(100vh-8rem)] px-4">
            <div className="fixed top-0 left-0 right-0 flex flex-col items-center pt-8 pb-4 bg-gradient-to-b from-breathing-dark to-transparent">
              <img src="/logo.svg" alt="Inhale.Lovable Logo" className="w-16 h-16 mb-2" />
              <h1 className="text-2xl font-light text-white tracking-wider">Inhale.Lovable</h1>
            </div>
            <div className="mt-32">
              <IntervalSettings
                {...settings}
                onUpdate={handleSettingsUpdate}
              />
            </div>
          </ScrollArea>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;