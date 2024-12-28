import React from "react";
import classNames from "classnames";

import Participant from "./Participant";
import useMainParticipant from "../hooks/useMainParticipant";
import useParticipants from "../hooks/useParticipants";
import useVideoContext from "../hooks/useVideoContext";
import useSelectedParticipant from "./VideoProvider/useSelectedParticipant";
import useScreenShareParticipant from "../hooks/useScreenShareParticipant";
import styles from "./ParticipantList.module.scss";

export default function ParticipantList() {
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] =
    useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const mainParticipant = useMainParticipant();
  const isRemoteParticipantScreenSharing =
    screenShareParticipant && screenShareParticipant !== localParticipant;

  if (participants.length === 0) return null; // Don't render this component if there are no remote participants.

  return (
    <aside
      className={classNames(styles.container, {
        [styles.transparentBackground]: !isRemoteParticipantScreenSharing,
      })}
    >
      <div className={styles.scrollContainer}>
        <div className={styles.innerScrollContainer}>
          <Participant
            participant={localParticipant}
            isLocalParticipant={true}
          />
          {participants.map((participant) => {
            const isSelected = participant === selectedParticipant;
            const hideParticipant =
              participant === mainParticipant &&
              participant !== screenShareParticipant &&
              !isSelected;
            return (
              <Participant
                key={participant?.sid}
                participant={participant}
                isSelected={participant === selectedParticipant}
                onClick={() => setSelectedParticipant(participant)}
                hideParticipant={hideParticipant}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
