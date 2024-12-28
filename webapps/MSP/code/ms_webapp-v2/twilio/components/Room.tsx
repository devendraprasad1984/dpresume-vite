import React from "react";
import classNames from "classnames";

import ParticipantList from "./ParticipantList";
import MainParticipant from "./MainParticipant";
import BackgroundSelectionDialog from "./BackgroundSelectionDialog";
import useVideoContext from "../hooks/useVideoContext";
import styles from "./Room.module.scss";

const Room = () => {
  const { isBackgroundSelectionOpen } = useVideoContext();
  return (
    <div
      className={classNames(
        styles.container,
        isBackgroundSelectionOpen && styles.rightDrawerOpen
      )}
    >
      <MainParticipant />
      <ParticipantList />
      <BackgroundSelectionDialog />
    </div>
  );
};

export default Room;
