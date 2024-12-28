import React from "react";
import { Participant } from "twilio-video";

import useParticipantNetworkQualityLevel from "../hooks/useParticipantNetworkQualityLevel";
import styles from "./NetworkQualityLevel.module.scss";

const STEP = 2.5;
const BARS_ARRAY = [0, 1, 2, 3, 4];

export default function NetworkQualityLevel({
  participant,
}: {
  participant: Participant;
}) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);

  if (networkQualityLevel === null) return null;

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        {BARS_ARRAY.map((level) => (
          <div
            className={styles.network}
            key={level}
            style={{
              height: `${STEP * (level + 1)}px`,
              background:
                networkQualityLevel > level
                  ? "white"
                  : "rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
