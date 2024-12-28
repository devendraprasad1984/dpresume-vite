import React from "react";

import { isMobile } from "../utils";
import Menu from "./Menu";
import useRoomState from "../hooks/useRoomState";
import useVideoContext from "../hooks/useVideoContext";
import ToggleAudioButton from "./ToggleAudioButton";
import ToggleVideoButton from "./ToggleVideoButton";
import ToggleScreenShareButton from "./ToggleScreenShareButton";
import styles from "./MenuBar.module.scss";
import ContainedButton from "../../components/buttons/ContainedButton";

const MenuBar = () => {
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === "reconnecting";
  const { room } = useVideoContext();

  return (
    <>
      {isSharingScreen && (
        <div className={styles.screenShareBanner}>
          <p className="subHeader">You are sharing your screen</p>
          <ContainedButton size="S" onClick={toggleScreenShare}>
            Stop Sharing
          </ContainedButton>
        </div>
      )}
      <footer className={styles.container}>
        <div className={styles.layout}>
          <h1 className={styles.roomName}>{room?.name || "Meeting"}</h1>
          <div className={styles.actionLayout}>
            <ToggleAudioButton disabled={isReconnecting} inverse={true} />
            <ToggleVideoButton disabled={isReconnecting} inverse={true} />
            {!isSharingScreen && !isMobile && (
              <ToggleScreenShareButton
                disabled={isReconnecting}
                inverse={true}
              />
            )}
            <Menu />
          </div>
          <div className={styles.secondaryActionLayout}>
            <ContainedButton
              onClick={() => {
                room?.disconnect();
              }}
            >
              End
            </ContainedButton>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MenuBar;
