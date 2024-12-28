import React from "react";

import useChatContext from "../../hooks/useChatContext";
import styles from "./ChatWindowHeader.module.scss";
import XButton from "../../../components/buttons/XButton";

export default function ChatWindowHeader() {
  const { setIsChatWindowOpen } = useChatContext();

  return (
    <div className={styles.container}>
      <h2 className="buttonText">Chat</h2>
      <XButton onClick={() => setIsChatWindowOpen(false)} />
    </div>
  );
}
