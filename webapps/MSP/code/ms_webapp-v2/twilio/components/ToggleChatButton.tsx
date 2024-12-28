import React from "react";
import classNames from "classnames";

import NavConversations from "../../public/static/icons/NavConversations.svg";
import useChatContext from "../hooks/useChatContext";
import useVideoContext from "../hooks/useVideoContext";
import styles from "./ToggleButton.module.scss";

interface Props {
  inverse?: boolean;
}

const ToggleChatButton = ({ inverse }: Props) => {
  const {
    isChatWindowOpen,
    setIsChatWindowOpen,
    conversation,
    hasUnreadMessages,
  } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
    setIsBackgroundSelectionOpen(false);
  };

  return (
    <button
      type="button"
      onClick={toggleChatWindow}
      disabled={!conversation}
      className={classNames(styles.button, inverse && styles.inverseButton)}
    >
      <div className={styles.iconContainer}>
        <NavConversations
          className={classNames(styles.icon, inverse && styles.inverseIcon)}
        />
        <span className={styles.buttonText}>Chat</span>
        <div
          className={classNames(
            styles.notice,
            styles.showNotice && hasUnreadMessages
          )}
        />
      </div>
    </button>
  );
};

export default ToggleChatButton;
