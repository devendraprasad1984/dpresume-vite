import React from "react";
import { Message } from "@twilio/conversations";

import MessageInfo from "./MessageInfo";
import MessageListScrollContainer from "./MessageListScrollContainer";
import TextMessage from "./TextMessage";
import useVideoContext from "../../hooks/useVideoContext";
import MediaMessage from "./MediaMessage";

interface MessageListProps {
  messages: Message[];
}

const getFormattedTime = (message?: Message) =>
  message?.dateCreated
    .toLocaleTimeString("en-us", { hour: "numeric", minute: "numeric" })
    .toLowerCase();

const MessageList = ({ messages }: MessageListProps) => {
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        const time = getFormattedTime(message)!;
        const previousTime = getFormattedTime(messages[idx - 1]);

        // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
        const shouldDisplayMessageInfo =
          time !== previousTime ||
          message?.author !== messages[idx - 1]?.author;

        const isLocalParticipant =
          localParticipant?.identity === message.author;

        return (
          <React.Fragment key={message.sid}>
            {shouldDisplayMessageInfo && (
              <MessageInfo
                author={message.author}
                isLocalParticipant={isLocalParticipant}
                dateCreated={time}
              />
            )}
            {message.type === "text" && (
              <TextMessage
                body={message.body}
                isLocalParticipant={isLocalParticipant}
              />
            )}
            {message.type === "media" && <MediaMessage media={message.media} />}
          </React.Fragment>
        );
      })}
    </MessageListScrollContainer>
  );
};

export default MessageList;
