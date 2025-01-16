import { useState, useEffect, useRef } from "react";
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
  const [progress, setProgress] = useState(0);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleMouseDown = () => {
    if (!isBreathing) {
      onStart();
      return;
    }
    
    setIsPressed(true);
    setProgress(0);

    const startTime = Date.now();
    const duration = 2000; // 2 seconds for long press

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress === 100) {
        onLongPress();
        setIsPressed(false);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, 50);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const getPhaseText = () => {
    if (!isBreathing) return "Start";
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  const getCircleStyles = () => {
    const baseStyles = "transition-all duration-2000 ease-in-out";
    
    if (!isBreathing) return baseStyles;
    
    switch (phase) {
      case "inhale":
        return `${baseStyles} scale-150`;
      case "hold":
        return `${baseStyles} scale-150`;
      case "exhale":
        return `${baseStyles} scale-90`;
      default:
        return baseStyles;
    }
  };

  const getProgressStyle = () => {
    if (isPressed) {
      return {
        background: `conic-gradient(#D6BCFA ${progress}%, transparent ${progress}%)`,
      };
    }
    return {};
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-64 h-64 rounded-full",
          "bg-breathing-primary bg-opacity-20",
          "cursor-pointer select-none",
          getCircleStyles()
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {(isPressed || phase === "hold") && (
          <div 
            className="absolute inset-0 rounded-full"
            style={getProgressStyle()}
          />
        )}
        <span className="text-white text-2xl font-light animate-fade-in z-10">
          {getPhaseText()}
        </span>
        {isPressed && (
          <span className="absolute bottom-10 text-white text-sm opacity-70 z-10">
            Long press to stop
          </span>
        )}
      </div>
    </div>
  );
};