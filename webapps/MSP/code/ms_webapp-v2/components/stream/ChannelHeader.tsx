import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import TruncateMarkup from "react-truncate-markup";
import { useChatContext } from "stream-chat-react";

import styles from "./ChannelHeader.module.scss";
import Avatar from "../core/Avatar";
import MoreActions, { IMoreAction } from "../core/MoreActions";
import ArchiveConversationModal from "../conversation/ArchiveConversationModal";
import useToast from "../../hooks/use-toast";
import messageService from "../../services/message-service";
import StartVideoModal from "../conversation/StartVideoModal";
import meetService from "../../services/meet-service";
import UserProfileName from "../core/UserProfileName";
import DeleteOneToOneChatModal from "../conversation/DeleteOneToOneChatModal";
import { Enum } from "./utils";
import useConversationHelper from "../stream/use-conversion-helper";
import Icon from "../core/Icon";
import Avatars from "../core/Avatars";

interface Props {
  onShowInformation: () => void;
  isShowInfo: boolean;
}

const ChannelHeader = observer(({ onShowInformation, isShowInfo }: Props) => {
  const { channel } = useChatContext();
  const {
    anotherMember,
    isGroupChannel,
    channelName,
    isTopicChannel,
    channelMembers,
  } = useConversationHelper();

  const { showSuccessMessage, showErrorMessage, showServerError } = useToast();
  const [isMuted, setIsMuted] = useState(channel?.muteStatus()?.muted);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStartVideoModalOpen, setIsStartVideoModalOpen] = useState(false);

  const onArchive = () => {
    setIsArchiveModalOpen(true);
  };
  const onDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const onArchiveConfirm = async () => {
    if (!channel?.id) {
      showErrorMessage({
        title: Enum.archive.errorTitle,
        message: Enum.archive.errorMessage,
      });
    }

    try {
      await messageService.archiveChannel(channel?.id);

      showSuccessMessage({
        title: Enum.archive.successTitle,
        message: Enum.archive.successMessage,
      });
      setIsArchiveModalOpen(false);
    } catch (error) {
      showServerError(error);
    }
  };

  const onDeleteConfirm = async () => {
    if (isGroupChannel || isTopicChannel) {
      showErrorMessage({
        title: "Information",
        message: "Operation not allowed",
      });
      return;
    }
    try {
      await messageService.deleteChatChannel(channel?.id);

      showSuccessMessage({
        title: Enum.delete.successTitle,
        message: Enum.delete.successMessage,
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      showServerError(error);
    }
  };

  const onStartVideo = () => {
    setIsStartVideoModalOpen(true);
  };

  const onStartVideoConfirm = async () => {
    try {
      await meetService.createRoom(channel?.id);
      setIsStartVideoModalOpen(false);
    } catch (error) {
      showServerError(error);
    }
  };

  const onMuteToggle = () => {
    const status = channel?.muteStatus()?.muted;

    if (status) {
      channel?.unmute();
    } else {
      channel?.mute();
    }

    // Mute status update is async, so we have to set the opposite status manually
    setIsMuted(!status);
  };

  const moreActions: IMoreAction[] = [
    {
      key: "showInformation",
      name: `${!isShowInfo ? "Show" : "Hide"} Information`,
      icon: "people",
      onClick: onShowInformation,
    },
    {
      key: "startVideo",
      name: "Start Video",
      icon: "video",
      onClick: onStartVideo,
    },
    {
      key: "mute",
      name: isMuted ? "Unmute" : "Mute",
      icon: isMuted ? "unmute" : "mute",
      onClick: onMuteToggle,
    },
    {
      key: "archive",
      name: "Archive",
      icon: "trash",
      onClick: onArchive,
      isDestructive: true,
      hideIf: isGroupChannel || isTopicChannel,
    },
    {
      key: "delete",
      name: "Delete?",
      icon: "trash",
      onClick: onDelete,
      isDestructive: true,
      hideIf: !isGroupChannel && !isTopicChannel,
    },
  ];

  useEffect(() => {
    if (channel) {
      setIsMuted(channel?.muteStatus()?.muted);
    }
  }, [channel]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.avatarGroup}>
            {!isGroupChannel && (
              <Avatar
                src={anotherMember?.["user"]?.picture}
                firstName={anotherMember?.["user"]?.firstName}
                lastName={anotherMember?.["user"]?.lastName}
                size="s"
                showOnlineStatus={true}
                isOnline={anotherMember?.["user"]?.online}
              />
            )}
            <div>
              {isGroupChannel && (
                <div className={styles.groupHeader}>
                  <Avatars
                    size="s"
                    avatars={channelMembers?.slice(0, 2)?.map((item) => ({
                      src: item?.user?.picture,
                      firstName: item?.user?.firstName,
                      lastName: item?.user?.lastName,
                      isOnline: item?.user?.isOnline,
                    }))}
                    totalCount={channelMembers?.length}
                  />
                  <div>
                    <TruncateMarkup lines={1}>
                      <h2 className={styles.channelTitle}>{channelName}</h2>
                    </TruncateMarkup>
                    <div className={styles.groupHeadline}>
                      <Icon
                        size={15}
                        iconSize={14}
                        icon="lock"
                        label="Lock"
                        kind="subtle"
                      />
                      <div>Private Group</div>
                    </div>
                  </div>
                </div>
              )}
              {!isGroupChannel && (
                <>
                  <UserProfileName
                    mode="header"
                    firstName={anotherMember?.["user"]?.firstName}
                    lastName={anotherMember?.["user"]?.lastName}
                    pronouns={anotherMember?.["user"]?.pronouns}
                  />
                  <div className={styles.headlines}>
                    {!isGroupChannel && (
                      <>
                        {anotherMember?.["user"]?.headline && (
                          <span>{anotherMember?.["user"]?.headline}</span>
                        )}
                        {anotherMember?.["user"]?.companyHeadline && (
                          <>
                            <span>&nbsp;&bull;&nbsp;</span>
                            <span>
                              {anotherMember?.["user"]?.companyHeadline}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <MoreActions id="channel-actions" data={[]} actions={moreActions} />
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteOneToOneChatModal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          onConfirm={onDeleteConfirm}
        />
      )}
      {isArchiveModalOpen && (
        <ArchiveConversationModal
          isOpen={isArchiveModalOpen}
          onRequestClose={() => setIsArchiveModalOpen(false)}
          onConfirm={onArchiveConfirm}
        />
      )}
      {isStartVideoModalOpen && (
        <StartVideoModal
          isOpen={isStartVideoModalOpen}
          onRequestClose={() => setIsStartVideoModalOpen(false)}
          onConfirm={onStartVideoConfirm}
        />
      )}
    </>
  );
});

export default ChannelHeader;
