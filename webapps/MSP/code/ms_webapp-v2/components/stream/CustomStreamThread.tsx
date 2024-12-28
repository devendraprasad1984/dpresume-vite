import React, { useEffect, useRef } from "react";

import {
  ThreadHeaderProps,
  useChannelStateContext,
  useChatContext,
  Message,
  MessageList,
  ThreadProps,
  useChannelActionContext,
  MessageInput,
} from "stream-chat-react";
import { StreamChatGenerics } from "stream-chat-react/dist/stories/utils";

import XButton from "../buttons/XButton";
import CustomStreamMessage from "./CustomStreamMessage";
import CustomStreamInput from "./CustomStreamInput";
import useEffectOnce from "../../hooks/use-effect-once";

/**
 * The Thread component renders a parent Message with a list of replies
 */
export const CustomStreamThread = () => {
  const { channel } = useChatContext();
  const { thread } = useChannelStateContext();

  // The wrapper ensures a key variable is set and the component recreates on thread switch
  return <ThreadInner key={`thread-${thread?.id}-${channel?.cid}`} />;
};

const ThreadHeader = (props: ThreadHeaderProps<StreamChatGenerics>) => {
  const { closeThread, thread } = props;

  const getReplyCount = () => {
    if (!thread.reply_count) return "";
    return `${thread.reply_count} Replies`;
  };

  return (
    <div className="str-chat__thread-header">
      <div className="str-chat__thread-header-details">
        <p className="header">Replies</p>
        <p className="str-chat__thread-header-details-replies">
          {getReplyCount()}
        </p>
      </div>
      <XButton
        className="str-chat__square-button"
        onClick={(event) => closeThread(event)}
      />
    </div>
  );
};

const ThreadInner = ({
  additionalMessageListProps,
  additionalParentMessageProps,
  autoFocus,
  additionalMessageInputProps,
}: ThreadProps) => {
  const { thread, threadHasMore, threadLoadingMore, threadMessages } =
    useChannelStateContext("Thread");
  const { closeThread, loadMoreThread } = useChannelActionContext();
  const { customClasses } = useChatContext<StreamChatGenerics>("Thread");

  const messageList = useRef<HTMLDivElement | null>(null);

  useEffectOnce(() => {
    if (thread?.id && thread?.reply_count) {
      loadMoreThread();
    }
  });

  useEffect(() => {
    if (messageList.current && threadMessages?.length) {
      const { clientHeight, scrollHeight, scrollTop } = messageList.current;
      const scrollDown = clientHeight + scrollTop !== scrollHeight;

      if (scrollDown) {
        messageList.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [threadMessages?.length]);

  if (!thread) return null;

  const threadClass = customClasses?.thread || "str-chat__thread";

  return (
    <div className={threadClass}>
      <ThreadHeader closeThread={closeThread} thread={thread} />
      <div className="str-chat__thread-list" ref={messageList}>
        <Message
          initialMessage
          message={thread}
          Message={CustomStreamMessage}
          threadList
          {...additionalParentMessageProps}
        />
        <MessageList
          Message={CustomStreamMessage}
          messageActions={["react", "edit", "delete"]}
          disableDateSeparator={true}
          hasMore={threadHasMore}
          loadingMore={threadLoadingMore}
          loadMore={loadMoreThread}
          messages={threadMessages || []}
          threadList
          {...additionalMessageListProps}
        />
      </div>
      <MessageInput
        focus={autoFocus}
        Input={CustomStreamInput}
        parent={thread}
        publishTypingEvent={false}
        grow={true}
        {...additionalMessageInputProps}
      />
    </div>
  );
};
