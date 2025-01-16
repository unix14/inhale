import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BreathingCircleProps {
  isBreathing: boolean;
  phase: "idle" | "inhale" | "hold" | "exhale";
  onLongPress: () => void;
  onStart: () => void;
}

export const BreathingCircle = ({
  isBreathing,
  phase,
  onLongPress,
  onStart,
}: BreathingCircleProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, [pressTimer]);

  const handleMouseDown = () => {
    if (!isBreathing) {
      onStart();
      return;
    }
    
    setIsPressed(true);
    const timer = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, 2000);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsPressed(false);
  };

  const getPhaseText = () => {
    if (!isBreathing) return "Start";
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "w-64 h-64 rounded-full",
        "bg-breathing-primary bg-opacity-20",
        "cursor-pointer select-none",
        "transition-transform duration-1000 ease-in-out",
        isBreathing && phase === "inhale" && "scale-125",
        isBreathing && phase === "exhale" && "scale-90"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {isPressed && (
        <div className="absolute inset-0 rounded-full border-2 border-white">
          <div
            className="absolute inset-0 rounded-full border-2 border-breathing-accent transition-all duration-2000"
            style={{
              clipPath: "inset(0 0 0 50%)",
              transform: "rotate(180deg)",
            }}
          />
        </div>
      )}
      <span className="text-white text-2xl font-light animate-fade-in">
        {getPhaseText()}
      </span>
      {isPressed && (
        <span className="absolute bottom-10 text-white text-sm opacity-70">
          Long press to stop
        </span>
      )}
    </div>
  );
};