import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface IntervalSettingsProps {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  onUpdate: (key: string, value: number) => void;
}

export const IntervalSettings = ({
  inhaleTime,
  holdTime,
  exhaleTime,
  onUpdate,
}: IntervalSettingsProps) => {
  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-white text-sm">Inhale Duration ({inhaleTime}s)</label>
          <Slider
            value={[inhaleTime]}
            min={2}
            max={10}
            step={1}
            onValueChange={(value) => onUpdate("inhaleTime", value[0])}
            className="w-full [&_.absolute]:bg-breathing-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-white text-sm">Hold Duration ({holdTime}s)</label>
          <Slider
            value={[holdTime]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => onUpdate("holdTime", value[0])}
            className="w-full [&_.absolute]:bg-breathing-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-white text-sm">Exhale Duration ({exhaleTime}s)</label>
          <Slider
            value={[exhaleTime]}
            min={2}
            max={10}
            step={1}
            onValueChange={(value) => onUpdate("exhaleTime", value[0])}
            className="w-full [&_.absolute]:bg-breathing-accent"
          />
        </div>
      </div>
    </div>
  );
};