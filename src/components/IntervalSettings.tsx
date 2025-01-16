import { Slider } from "@/components/ui/slider";

interface IntervalSettingsProps {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  onUpdate: (key: string, value: number) => void;
}

export const IntervalSettings = ({
  inhaleTime,
  holdTime,
  exhaleTime,
  cycles,
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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-white text-sm">Number of Cycles ({cycles})</label>
          <Slider
            value={[cycles]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => onUpdate("cycles", value[0])}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};