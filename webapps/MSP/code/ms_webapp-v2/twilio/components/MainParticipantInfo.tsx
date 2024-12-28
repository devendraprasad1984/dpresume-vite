import React from "react";
import {
  LocalAudioTrack,
  LocalVideoTrack,
  Participant,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from "twilio-video";
import classNames from "classnames";

import styles from "./MainParticipantInfo.module.scss";
import AudioLevelIndicator from "./AudioLevelIndicator";
import NetworkQualityLevel from "./NetworkQualityLevel";
import useIsRecording from "../hooks/useIsRecording";
import useIsTrackSwitchedOff from "../hooks/useIsTrackSwitchedOff";
import useParticipantIsReconnecting from "../hooks/useParticipantIsReconnecting";
import usePublications from "../usePublications";
import useScreenShareParticipant from "../hooks/useScreenShareParticipant";
import useTrack from "../hooks/useTrack";
import useVideoContext from "../hooks/useVideoContext";
import Avatar from "../../components/core/Avatar";
import Tooltip from "../../components/core/Tooltip";

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

const MainParticipantInfo = ({
  participant,
  children,
}: MainParticipantInfoProps) => {
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const isLocal = localParticipant === participant;

  const screenShareParticipant = useScreenShareParticipant();
  const isRemoteParticipantScreenSharing =
    screenShareParticipant && screenShareParticipant !== localParticipant;

  const publications = usePublications(participant);
  const videoPublication = publications.find(
    (p) => !p.trackName.includes("screen") && p.kind === "video"
  );
  const screenSharePublication = publications.find((p) =>
    p.trackName.includes("screen")
  );

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoEnabled = Boolean(videoTrack);

  const audioPublication = publications.find((p) => p.kind === "audio");
  const audioTrack = useTrack(audioPublication) as
    | LocalAudioTrack
    | RemoteAudioTrack
    | undefined;

  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack
  );
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const isRecording = useIsRecording();

  return (
    <div
      className={classNames(
        styles.container,
        !isRemoteParticipantScreenSharing && styles.fullWidth
      )}
    >
      <div className={styles.infoContainer}>
        <div className={styles.identity}>
          <AudioLevelIndicator audioTrack={audioTrack} />
          <span className="smallLabel">
            {participant?.identity}
            {isLocal && " (You)"}
            {screenSharePublication && " - Screen"}
          </span>
        </div>
        <NetworkQualityLevel participant={participant} />
        {isRecording && (
          <Tooltip
            overlay="All participants' audio and video is currently being recorded. Visit the app settings to stop recording."
            placement="bottom"
          >
            <div className={styles.recordingIndicator}>
              <div className={styles.circle}></div>
              <p className="smallLabel">Recording</p>
            </div>
          </Tooltip>
        )}
      </div>
      {(!isVideoEnabled || isVideoSwitchedOff) && (
        <div className={styles.avatarContainer}>
          <Avatar size="l" src="/static/mock/avatar-keelie-banks.png" />
        </div>
      )}
      {isParticipantReconnecting && (
        <div className={styles.reconnectingContainer}>
          <p style={{ color: "white" }}>Reconnecting...</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default MainParticipantInfo;
