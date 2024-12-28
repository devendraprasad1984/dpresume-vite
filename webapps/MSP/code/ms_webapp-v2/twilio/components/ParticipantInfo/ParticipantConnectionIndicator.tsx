import React from "react";
import { Participant } from "twilio-video";
import classNames from "classnames";

import useParticipantIsReconnecting from "../../hooks/useParticipantIsReconnecting";
import styles from "./ParticipantConnectionIndicator.module.scss";
import Tooltip from "../../../components/core/Tooltip";

const ParticipantConnectionIndicator = ({
  participant,
}: {
  participant: Participant;
}) => {
  const isReconnecting = useParticipantIsReconnecting(participant);
  return (
    <Tooltip
      overlay={
        isReconnecting
          ? "Participant is reconnecting"
          : "Participant is connected"
      }
    >
      <span
        className={classNames(styles.indicator, {
          [styles.isReconnecting]: isReconnecting,
        })}
      />
    </Tooltip>
  );
};

export default ParticipantConnectionIndicator;
