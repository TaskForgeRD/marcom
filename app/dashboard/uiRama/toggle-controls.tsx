"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ToggleControlsProps {
  label: string;
  switchState: boolean;
  onToggleSwitch: (checked: boolean) => void;

  togglePanelState: boolean;
  onTogglePanel: () => void;

  togglePanelLabel?: {
    show: string;
    hide: string;
  };
}

const ToggleControls: React.FC<ToggleControlsProps> = ({
  label,
  switchState,
  onToggleSwitch,
  togglePanelState,
  onTogglePanel,
  togglePanelLabel = {
    show: "",
    hide: "",
  },
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="generic-toggle-switch"
          checked={switchState}
          onCheckedChange={onToggleSwitch}
        />
        <label
          htmlFor="generic-toggle-switch"
          className="text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      </div>
      <button
        onClick={onTogglePanel}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {togglePanelState ? togglePanelLabel.hide : togglePanelLabel.show}
        {togglePanelState ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default ToggleControls;
