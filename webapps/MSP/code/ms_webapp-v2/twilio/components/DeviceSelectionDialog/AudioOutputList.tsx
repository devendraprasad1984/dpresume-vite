import React from "react";

import Select from "../../../components/form/Select";
import { useAppState } from "../../state";
import useDevices from "../../hooks/useDevices";
import Label from "../../../components/form/Label";

export default function AudioOutputList() {
  const { audioOutputDevices } = useDevices();
  const { activeSinkId, setActiveSinkId } = useAppState();
  const activeOutputLabel = audioOutputDevices.find(
    (device) => device.deviceId === activeSinkId
  )?.label;

  return (
    <Label
      label="Audio Output"
      htmlFor="audio-output-select"
      shiftLabel={false}
    >
      {audioOutputDevices.length > 1 ? (
        <Select
          id="audio-output-select"
          onChange={(value) => setActiveSinkId(value as string)}
          value={activeSinkId}
        >
          {audioOutputDevices.map((device) => (
            <option value={device.deviceId} key={device.deviceId}>
              {device.label}
            </option>
          ))}
        </Select>
      ) : (
        <p>{activeOutputLabel || "System Default Audio Output"}</p>
      )}
    </Label>
  );
}
