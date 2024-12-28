import React from "react";
import { LocalAudioTrack } from "twilio-video";

import useVideoContext from "../hooks/useVideoContext";
import AudioLevelIndicator from "./AudioLevelIndicator";

const LocalAudioLevelIndicator = () => {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(
    (track) => track.kind === "audio"
  ) as LocalAudioTrack;

  return <AudioLevelIndicator audioTrack={audioTrack} />;
};

export default LocalAudioLevelIndicator;
