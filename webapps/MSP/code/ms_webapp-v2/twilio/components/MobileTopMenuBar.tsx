import React from "react";

import Menu from "./Menu";
import useVideoContext from "../hooks/useVideoContext";
import styles from "./MobileTopMenuBar.module.scss";
import ContainedButton from "../../components/buttons/ContainedButton";

const MobileTopMenuBar = () => {
  const { room } = useVideoContext();

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <h1 className={styles.roomName}>{room?.name || "Meeting"}</h1>
        <div className={styles.actionLayout}>
          <ContainedButton size="S" onClick={room?.disconnect}>
            End
          </ContainedButton>
          <Menu showLabel={false} />
        </div>
      </div>
    </div>
  );
};

export default MobileTopMenuBar;
