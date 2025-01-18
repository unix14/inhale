import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { audioManager } from "@/utils/audioUtils";
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
  const [volume, setVolume] = useState(audioManager.getVolume() * 100);
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(value[0]);
    audioManager.setVolume(newVolume);
  };

  const handleMuteToggle = (checked: boolean) => {
    setIsMuted(checked);
    audioManager.setMuted(checked);
  };

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

        <div className="border-t border-breathing-accent/20 pt-4 mt-4">
          <h3 className="text-white text-sm font-medium mb-4">Sound Settings</h3>
          
          <div className="flex items-center justify-between mb-4">
            <label className="text-white text-sm">Mute Sounds</label>
            <Switch
              checked={isMuted}
              onCheckedChange={handleMuteToggle}
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm">Volume ({Math.round(volume)}%)</label>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-full [&_.absolute]:bg-breathing-accent"
              disabled={isMuted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};