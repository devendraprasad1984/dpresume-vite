import React from "react";
import {
  LocalAudioTrack,
  LocalVideoTrack,
  Participant,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from "twilio-video";

import AudioLevelIndicator from "../AudioLevelIndicator";
import NetworkQualityLevel from "../NetworkQualityLevel";
import Pin from "../../../public/static/icons/Pin.svg";
import ScreenShareIcon from "../../../public/static/icons/ScreenShare.svg";
import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff";
import usePublications from "../../usePublications";
import useTrack from "../../hooks/useTrack";
import useParticipantIsReconnecting from "../../hooks/useParticipantIsReconnecting";
import styles from "./ParticipantInfo.module.scss";
import classNames from "classnames";
import Avatar from "../../../components/core/Avatar";

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  isLocalParticipant,
  hideParticipant,
}: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const audioPublication = publications.find((p) => p.kind === "audio");
  const videoPublication = publications.find(
    (p) => !p.trackName.includes("screen") && p.kind === "video"
  );

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find((p) =>
    p.trackName.includes("screen")
  );

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack
  );

  const audioTrack = useTrack(audioPublication) as
    | LocalAudioTrack
    | RemoteAudioTrack
    | undefined;
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  return (
    <div
      className={classNames(styles.container, {
        [styles.hideParticipant]: hideParticipant,
        [styles.cursorPointer]: Boolean(onClick),
      })}
      onClick={onClick}
    >
      <div className={styles.infoContainer}>
        <NetworkQualityLevel participant={participant} />
        <div className={styles.infoRowBottom}>
          <span className={styles.identity}>
            {isScreenShareEnabled && (
              <span className={styles.screenShareIconContainer}>
                <ScreenShareIcon className={styles.icon} />
              </span>
            )}
            <AudioLevelIndicator audioTrack={audioTrack} />
            <span className="smallLabel">
              {participant?.identity}
              {isLocalParticipant && " (You)"}
            </span>
          </span>
        </div>
        <div>{isSelected && <Pin />}</div>
      </div>
      <div className={styles.innerContainer}>
        {(!isVideoEnabled || isVideoSwitchedOff) && (
          <div className={styles.avatarContainer}>
            <Avatar size="l" src={null} firstName={participant?.identity} />
          </div>
        )}
        {isParticipantReconnecting && (
          <div className={styles.reconnectingContainer}>
            <span>Reconnecting...</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
