import React from "react";
import classNames from "classnames";

import ChatWindowHeader from "./ChatWindowHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import useChatContext from "../../hooks/useChatContext";
import styles from "./ChatWindow.module.scss";

// In this component, we are toggling the visibility of the ChatWindow with CSS instead of
// conditionally rendering the component in the DOM. This is done so that the ChatWindow is
// not unmounted while a file upload is in progress.

const ChatWindow = () => {
  const { isChatWindowOpen, messages, conversation } = useChatContext();

  return (
    <aside
      className={classNames(styles.chatWindowContainer, {
        [styles.hide]: !isChatWindowOpen,
      })}
    >
      <ChatWindowHeader />
      <MessageList messages={messages} />
      <ChatInput
        conversation={conversation!}
        isChatWindowOpen={isChatWindowOpen}
      />
    </aside>
  );
};

export default ChatWindow;
