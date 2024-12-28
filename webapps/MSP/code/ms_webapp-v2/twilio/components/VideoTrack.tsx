import React, { useRef, useEffect } from "react";
import { Track } from "twilio-video";
import classNames from "classnames";

import useMediaStreamTrack from "../hooks/useMediaStreamTrack";
import useVideoTrackDimensions from "../hooks/useVideoTrackDimensions";
import styles from "./VideoTrack.module.scss";
import { IVideoTrack } from "../types";

interface VideoTrackProps {
  previewStyle?: boolean;
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

const VideoTrack = ({
  previewStyle,
  track,
  isLocal,
  priority,
}: VideoTrackProps) => {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);
  const dimensions = useVideoTrackDimensions(track);
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;

      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing =
    mediaStreamTrack?.getSettings().facingMode !== "environment";
  const style = {
    transform: isLocal && isFrontFacing ? "rotateY(180deg)" : "",
    objectFit:
      isPortrait || track.name.includes("screen")
        ? ("contain" as const)
        : ("cover" as const),
  };

  return (
    <video
      className={classNames(styles.video, previewStyle && styles.preview)}
      ref={ref}
      style={style}
    />
  );
};

export default VideoTrack;
