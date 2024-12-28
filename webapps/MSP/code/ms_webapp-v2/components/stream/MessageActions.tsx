import { SyntheticEvent } from "react";
import { CustomMessageActions, useMessageContext } from "stream-chat-react";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";

import styles from "./MessageActions.module.scss";
import BookmarkIcon from "../../public/static/icons/Bookmark.svg";
import SmileyFace from "../../public/static/icons/SmileyFace.svg";
import MessageCircleIcon from "../../public/static/icons/MessageCircle.svg";
import MoreActions, { IMoreAction } from "../core/MoreActions";

interface Props {
  isMyMessage: boolean;
  actions: CustomMessageActions<DefaultStreamChatGenerics>;
  onShowReaction?: () => void;
  handleReply?: (event: SyntheticEvent) => void;
  handleEdit?: (event: SyntheticEvent) => void;
  handleDelete?: (event: SyntheticEvent) => void;
  handleSave?: (event: SyntheticEvent) => void;
}

export const MessageActions = ({
  onShowReaction,
  isMyMessage,
  handleReply,
  handleEdit,
  handleDelete,
  handleSave,
}: Props) => {
  const { getMessageActions, message, actionsEnabled } = useMessageContext();
  const defaultActions = getMessageActions();
  const canEdit = defaultActions.includes("edit") && actionsEnabled;
  const canReply = defaultActions.includes("reply") && actionsEnabled;
  const canDelete = defaultActions.includes("delete") && actionsEnabled;

  const menuActions: IMoreAction[] = [];

  if (canEdit) {
    menuActions.push({
      key: "editMessage",
      name: "Edit",
      icon: "edit",
      onClick: handleEdit,
    });
  }
  if (canDelete) {
    menuActions.push({
      key: "deleteMessage",
      name: "Delete",
      icon: "trash",
      onClick: handleDelete,
    });
  }

  return (
    <div
      className={
        isMyMessage ? styles.actionsWrapper : styles.actionsWrapperReverse
      }
    >
      {actionsEnabled && (
        <button
          className={styles.actionButton}
          type="button"
          onClick={handleSave}
        >
          <div className={styles.actionIconWrapper}>
            <BookmarkIcon />
          </div>
        </button>
      )}
      {canReply && (
        <button
          className={styles.actionButton}
          type="button"
          onClick={handleReply}
        >
          <div className={styles.actionIconWrapper}>
            <MessageCircleIcon />
          </div>
        </button>
      )}
      {actionsEnabled && (
        <button
          className={styles.actionButton}
          type="button"
          onClick={onShowReaction}
        >
          <div className={styles.actionIconWrapper}>
            <SmileyFace />
          </div>
        </button>
      )}
      {menuActions?.length > 0 && (
        <MoreActions
          id="message-action-menu"
          actions={menuActions}
          data={message}
          size="sm"
        />
      )}
    </div>
  );
};
