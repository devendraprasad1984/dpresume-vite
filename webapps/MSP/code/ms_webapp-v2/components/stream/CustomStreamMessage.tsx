import React, { useEffect, useState } from "react";
import {
  Attachment,
  MessageContextValue,
  messageHasReactions,
  messageHasAttachments,
  MessageRepliesCountButton,
  MessageText,
  ReactionSelector,
  SimpleReactionsList,
  useMessageContext,
  useChatContext,
  useActionHandler,
} from "stream-chat-react";
import { BaseEmoji } from "emoji-mart";
import classNames from "classnames";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";
import dayjs from "dayjs";

import styles from "./CustomStreamMessage.module.scss";
import { DeleteMessageModal } from "./DeleteMessageModal";
import { EditMessageModal } from "./EditMessageModal";
import { MessageActions } from "./MessageActions";
import useToast from "../../hooks/use-toast";
import DeletedMessage from "./DeletedMessage";
import VideoCallMessage from "./VideoCallMessage";
import { CustomStreamData } from "../../@types/Conversation";
import fullName from "../../utils/full-name";
import Avatar from "../core/Avatar";
import useConversationHelper from "./use-conversion-helper";

type MessageSimpleWithContextProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = MessageContextValue<StreamChatGenerics>;

const CustomStreamMessage = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  props: MessageSimpleWithContextProps<StreamChatGenerics>
) => {
  const { showServerError } = useToast();
  const { client } = useChatContext();
  const { isGroupChannel, isTopicChannel } = useConversationHelper();
  const shouldShowSenders = isGroupChannel || isTopicChannel;

  const {
    message,
    customMessageActions,
    isMyMessage,
    handleReaction,
    handleOpenThread,
    isReactionEnabled,
    highlighted,
    groupedByUser,
    firstOfGroup,
    endOfGroup,
    threadList,
  } = useMessageContext();
  const handleAction = useActionHandler(message);

  const customData = message?.custom as CustomStreamData;

  const myMessage = isMyMessage();
  const hasAttachment = messageHasAttachments(message);
  const hasReactions = messageHasReactions(message);
  const messageClasses = isMyMessage()
    ? "str-chat__message str-chat__message--me str-chat__message-simple str-chat__message-simple--me"
    : "str-chat__message str-chat__message-simple";
  const hasInstantVideoCall = customData?.type === "InstantVideoCall";
  const senderName = fullName([
    message?.user?.firstName as string,
    message?.user?.lastName as string,
  ]);
  const messageTimestamp = dayjs(message?.updated_at).format("h:mm a");

  //Deleting message and disable actions
  //TODO add Styles to the text
  const DeleteMessage = async () => {
    await client
      .deleteMessage(message.id)
      .then(() => {
        setShowDeleteModal(false);
        setShowActions(false);
      })
      .catch((err) => showServerError(err));
  };

  //Pin the message and set no expiration for pinned message
  //TODO adding styles to the text
  const handleSave = async () => {
    await client.pinMessage(message, null).catch((err) => showServerError(err));
  };

  // STATE
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showReactionSelector, setShowReactionSelector] =
    useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const hideReactionSelector = () => {
    setShowReactionSelector(false);
  };

  // HOOKS
  useEffect(() => {
    window.addEventListener("keydown", hideReactionSelector);

    return () => {
      window.removeEventListener("keydown", hideReactionSelector);
    };
  }, []);
  // METHODS
  const onHandleReaction = (
    reactionType: string,
    event: React.BaseSyntheticEvent<object, any, any>
  ) => {
    hideReactionSelector();
    return handleReaction(reactionType, event);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  //Message Patch
  const ConfirmEditMessage = async (text) => {
    await client
      .partialUpdateMessage(message.id, {
        set: {
          text,
        },
      })
      .then(() => {
        setShowEditModal(false);
      })
      .catch((err) => showServerError(err));
  };

  const customReactions: BaseEmoji[] = [
    {
      colons: ":laughing:",
      emoticons: ["x)"],
      id: "laughing",
      name: "Grinning Squinting Face",
      native: "😆",
      skin: null,
      unified: "1F606",
    },
    {
      colons: ":heart:",
      emoticons: ["<3"],
      id: "heart",
      name: "Heart",
      native: "❤️",
      skin: null,
      unified: "2764",
    },
    {
      colons: ":+1:",
      emoticons: ["b"],
      id: "+1",
      name: "Thumbs Up",
      native: "👍",
      skin: null,
      unified: "1F44D",
    },
  ];

  return (
    <div
      className={classNames(
        messageClasses,
        `str-chat__message--${message.type}`,
        `str-chat__message--${message.status}`,
        message.text ? "str-chat__message--has-text" : "has-no-text",
        hasAttachment ? "str-chat__message--has-attachment" : "",
        hasReactions && isReactionEnabled
          ? "str-chat__message--with-reactions"
          : "",
        highlighted ? "str-chat__message--highlighted" : "",
        message.pinned ? "pinned-message" : "",
        groupedByUser ? "str-chat__virtual-message__wrapper--group" : "",
        firstOfGroup ? "str-chat__virtual-message__wrapper--first" : "",
        endOfGroup ? "str-chat__virtual-message__wrapper--end" : ""
      )}
      onMouseLeave={() => setShowActions(false)}
      onMouseEnter={() => setShowActions(true)}
    >
      <div
        className={classNames(
          styles.avatarMessageGroup,
          myMessage && styles.myMessage
        )}
      >
        {shouldShowSenders && !myMessage && (
          <Avatar
            size="xs"
            src={message?.user?.picture as string}
            firstName={message?.user?.firstName as string}
            lastName={message?.user?.lastName as string}
          />
        )}
        <div>
          {showReactionSelector && (
            <div className={styles.reactionSelectorWrapper}>
              <ReactionSelector
                ref={props.reactionSelectorRef}
                handleReaction={onHandleReaction}
                reactionOptions={customReactions}
              />
            </div>
          )}
          {shouldShowSenders && !myMessage && (
            <div className={styles.senderInfo}>
              <span className={styles.senderName}>{senderName}</span>
              <span className={styles.messageTimestamp}>
                {messageTimestamp}
              </span>
            </div>
          )}
          <div
            className={classNames(
              styles.messageActionGroup,
              myMessage && styles.myMessage
            )}
          >
            {["regular", "reply"].includes(message.type) &&
              !customData &&
              showActions && (
                <MessageActions
                  isMyMessage={myMessage}
                  actions={customMessageActions}
                  onShowReaction={() =>
                    setShowReactionSelector((prev) => !prev)
                  }
                  handleReply={handleOpenThread}
                  handleEdit={() => setShowEditModal(true)}
                  handleDelete={() => setShowDeleteModal(true)}
                  handleSave={handleSave}
                />
              )}
            <div>
              {["regular", "reply"].includes(message.type) && !customData && (
                <MessageText />
              )}
              {message.type === "deleted" && <DeletedMessage />}
              {hasInstantVideoCall && (
                <VideoCallMessage customData={customData} />
              )}
              <Attachment
                attachments={message.attachments}
                actionHandler={handleAction}
              />
              {message.type === "regular" && !threadList && (
                <MessageRepliesCountButton
                  onClick={handleOpenThread}
                  reply_count={message.reply_count}
                />
              )}
            </div>
          </div>
          {hasReactions && <SimpleReactionsList />}
        </div>
      </div>

      {showEditModal && (
        <EditMessageModal
          isOpen={showEditModal}
          onRequestClose={closeEditModal}
          onConfirm={ConfirmEditMessage}
          messageText={message?.text}
        />
      )}
      {showDeleteModal && (
        <DeleteMessageModal
          isOpen={showDeleteModal}
          onRequestClose={closeDeleteModal}
          onConfirm={DeleteMessage}
        />
      )}
    </div>
  );
};

export default CustomStreamMessage;
