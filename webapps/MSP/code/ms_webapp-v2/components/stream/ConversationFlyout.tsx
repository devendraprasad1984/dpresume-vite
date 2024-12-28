import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import TruncateMarkup from "react-truncate-markup";
import { useChatContext } from "stream-chat-react";

import Avatar from "../core/Avatar";
import styles from "./ConversationFlyout.module.scss";
import messageService from "../../services/message-service";
import useToast from "../../hooks/use-toast";
import * as utils from "./utils";
import { copyToClipBoard, Enum } from "./utils";
import MoreActions, { IMoreAction } from "../core/MoreActions";
import EditGroupModal from "../conversation/EditGroupModal";
import SeeAllMembersOverlay from "./converse-info-overlays/SeeMembersOverlay";
import SearchChatOverlay from "./converse-info-overlays/SearchChatOverlay";
import XButton from "../buttons/XButton";
import { IMember, IScheduleVideoCallBody } from "../../@types/Conversation";
import GroupInviteUserAddModal from "../conversation/GroupInviteUserAddModal";
import IconUtil from "../core/IconsUtil";
import UserProfileName from "../core/UserProfileName";
import TextButton from "../buttons/TextButton";
import Avatars from "../core/Avatars";
import useAppStores from "../../stores/app-context";
import useConversationHelper from "../stream/use-conversion-helper";
import ScheduleVideoModal from "../conversation/ScheduleVideoModal";
import meetService from "../../services/meet-service";

interface Props {
  isShowInfo: boolean;
  onShowInformation: () => void;
}

const avatarSize = "s";

const ConversationFlyout = observer(({ onShowInformation }: Props) => {
  const { appStore } = useAppStores();
  const { channel } = useChatContext();
  const {
    anotherMember,
    isGroupChannel,
    isTopicChannel,
    channelMembers,
    channelName,
    channelCreatorRef,
  } = useConversationHelper();

  const { showSuccessMessage, showErrorMessage, showServerError } = useToast();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [mute, setMute] = useState<boolean>(false);
  const [isShowGroupModal, setIsShowGroupModal] = useState<boolean>(false);
  const [isShowInviteMembers, setIsShowInviteMembers] =
    useState<boolean>(false);
  const [showOverlayByType, setShowOverlayByType] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isShowScheduleVideoCallModal, setIsShowScheduleVideoCallModal] =
    useState<boolean>(false);

  const moreActions: IMoreAction[] = [
    {
      key: "invitePeople",
      name: `Invite People`,
      icon: "peoplePlus",
      onClick: () => {
        setIsShowInviteMembers(true);
      },
    },
    {
      key: "scheduleSession",
      name: `Schedule Session`,
      icon: "schedule",
      onClick: () => {
        console.log("more action 2");
      },
    },
    {
      key: "editTopic",
      name: `Edit Topic`,
      icon: "editTopic",
      onClick: () => {
        console.log("more action 3");
      },
    },
    {
      key: "viewTopic",
      name: `View Topic`,
      icon: "viewTopic",
      onClick: () => {
        console.log("more action 4");
      },
    },
  ];

  useEffect(() => {
    return () => {
      setSearchInput("");
    };
  }, []);

  //-----------------Page Actions------------------
  const handleArchiveConversation = async () => {
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
    } catch (error) {
      showServerError(error);
    }
  };

  const handleMute = () => {
    try {
      const status = channel?.muteStatus()?.muted;
      if (status) {
        channel?.unmute();
      } else {
        channel?.mute();
      }
      showSuccessMessage({
        title: !mute ? Enum.mute.successTitle : Enum.unmute.successTitle,
        message: !mute ? Enum.mute.successMessage : Enum.unmute.successMessage,
      });
      setMute(!mute);
    } catch (error) {
      showServerError(error);
    }
  };

  const handleSearch = () => {
    setShowOverlayByType(Enum.OverlayEnum.search);
  };

  const handleCopyUrl = () => {
    const channelUrl =
      window.location.origin +
        "/ms/conversations/" +
        "?channel=" +
        channel.id || "";
    const isCopied = copyToClipBoard(channelUrl);
    if (isCopied)
      showSuccessMessage({
        title: Enum.urlCopy.successTitle,
        message: Enum.urlCopy.successMessage,
      });
    else
      showErrorMessage({
        title: Enum.urlCopy.errorTitle,
        message: Enum.urlCopy.errorMessage,
      });
  };

  const handleShowMoreInfo = () => {
    setShowMore(!showMore);
  };

  const handleSeeAllAndManageMembers = () => {
    if (isGroupChannel) setShowOverlayByType(Enum.OverlayEnum.seeAllMembers);
  };

  const handleEditGroupName = () => {
    if (channelCreatorRef === appStore?.user?.user?.ref) {
      setIsShowGroupModal(!isShowGroupModal);
    } else {
      showErrorMessage({
        title: utils.Enum.editGroupName.failedTitle,
        message: utils.Enum.editGroupName.failedMessage,
      });
    }
  };

  const onConfirmEditGroupNameModal = async (newGroupName: string) => {
    if (channelName !== newGroupName) {
      try {
        await channel.update({
          name: newGroupName,
        });
        showSuccessMessage({
          title: Enum.groupNameUpdate.successTitle,
          message: Enum.groupNameUpdate.successMessage,
        });
      } catch (err) {
        showErrorMessage({
          title: Enum.groupNameUpdate.errorTitle,
          message: Enum.groupNameUpdate.errorMessage,
        });
      } finally {
        setIsShowGroupModal(!isShowGroupModal);
      }
    }
  };

  const handleOverlayClose = () => {
    setShowOverlayByType("");
  };

  const handleScheduleVideoCallAction = () => {
    setIsShowScheduleVideoCallModal(true);
  };

  const onScheduleVideoCall = async (data: IScheduleVideoCallBody) => {
    if (data === undefined) return;
    try {
      await meetService.schedule(data);
      setIsShowScheduleVideoCallModal(false);
      showSuccessMessage({
        title: Enum.scheduleVideoCall.successTitle,
        message: Enum.scheduleVideoCall.successMessage,
      });
    } catch (error) {
      showServerError(error);
    }
  };

  //----Layout Components section by section from figma--------------------

  //TODO: remove and add really text giving meeting context
  const chatMeetingInfoText =
    "Lorem ipsum channel info - meeting textLorem ipsum channel info - meeting textLorem ipsum channel info - meeting textLorem ipsum channel info - meeting textLorem ipsum channel info - meeting text";

  const showMeetingText = () => {
    return chatMeetingInfoText.length < 100 || showMore ? (
      <div>
        {chatMeetingInfoText}
        {showMore && (
          <span
            className={classNames(styles.showMoreInfo)}
            onClick={() => handleShowMoreInfo()}
          >
            Hide
          </span>
        )}
      </div>
    ) : (
      <div className={classNames(styles.column, styles.left)}>
        <p>{chatMeetingInfoText.substring(0, 100)}...</p>
        <span
          className={classNames(styles.showMoreInfo)}
          onClick={() => handleShowMoreInfo()}
        >
          show more info
        </span>
      </div>
    );
  };

  const FlyoutHeader = () => {
    return (
      <div className={styles.headerSection}>
        <h2 className="header">Conversation Info</h2>
        <div className={styles.headerActions}>
          <XButton onClick={onShowInformation} />
          {isTopicChannel && (
            <MoreActions id="channel-actions" data={[]} actions={moreActions} />
          )}
        </div>
      </div>
    );
  };

  const UserDisplayOneToOne = () => {
    return (
      <div className={styles.singUserDisplaySection}>
        <Avatar
          src={anotherMember?.["user"]?.picture}
          firstName={anotherMember?.["user"]?.firstName}
          lastName={anotherMember?.["user"]?.lastName}
          size={"xl"}
          showOnlineStatus={true}
          isOnline={anotherMember?.["user"]?.online}
          className={styles.center}
        />
        <UserProfileName
          mode="header"
          firstName={anotherMember?.["user"]?.firstName}
          lastName={anotherMember?.["user"]?.lastName}
          pronouns={anotherMember?.["user"]?.pronouns}
        />
      </div>
    );
  };

  const UserDisplayTopic = () => {
    return (
      <div>
        <div>
          <Avatar
            src={anotherMember?.["user"]?.picture}
            firstName={anotherMember?.["user"]?.firstName}
            lastName={anotherMember?.["user"]?.lastName}
            size={avatarSize}
            showOnlineStatus={true}
            isOnline={anotherMember?.["user"]?.online}
            className={styles.center}
          />
          <h3>Meeting Title</h3>
        </div>
        {showMeetingText()}
      </div>
    );
  };

  const UserDisplayGroup = () => {
    return (
      <>
        <div className={styles.groupUserDisplaySection}>
          <div>
            <Avatars
              size="l"
              withBorder={true}
              showOnlineStatus={true}
              avatars={[
                {
                  src: channelMembers?.[0]?.user?.picture,
                  firstName: channelMembers?.[0]?.user?.firstName,
                  lastName: channelMembers?.[0]?.user?.lastName,
                  isOnline: channelMembers?.[0]?.user?.online,
                },
                {
                  src: channelMembers?.[1]?.user?.picture,
                  firstName: channelMembers?.[1]?.user?.firstName,
                  lastName: channelMembers?.[1]?.user?.lastName,
                  isOnline: channelMembers?.[1]?.user?.online,
                },
              ]}
              totalCount={channelMembers?.length}
            />
          </div>
          {channelName && (
            <TruncateMarkup lines={1}>
              <p className={styles.groupName}>{channelName}</p>
            </TruncateMarkup>
          )}
          <TextButton onClick={handleEditGroupName}>Edit Group Name</TextButton>
        </div>

        {isShowGroupModal && (
          <EditGroupModal
            groupName={channelName}
            isOpen={isShowGroupModal}
            onRequestClose={() => setIsShowGroupModal(false)}
            onConfirm={onConfirmEditGroupNameModal}
          />
        )}
      </>
    );
  };

  const DisplayUserActionLinks = () => {
    return (
      <div className={styles.actionLinksSection}>
        {isGroupChannel && (
          <button
            type="button"
            className={styles.iconGroup}
            onClick={handleScheduleVideoCallAction}
          >
            <div className={styles.iconWrapper}>
              <IconUtil icon={"videoPlus"} height={24} width={24} />
            </div>
            <div className={styles.iconLabel}>Schedule</div>
          </button>
        )}
        {isTopicChannel && (
          <button
            type="button"
            className={styles.iconGroup}
            onClick={handleCopyUrl}
          >
            <div className={styles.iconWrapper}>
              <IconUtil icon={"link"} height={24} width={24} />
            </div>
            <div className={styles.iconLabel}>Copy Url</div>
          </button>
        )}
        <button type="button" className={styles.iconGroup} onClick={handleMute}>
          <div className={styles.iconWrapper}>
            {mute ? (
              <IconUtil icon={"mute"} height={24} width={24} />
            ) : (
              <IconUtil icon={"unmute"} height={24} width={24} />
            )}
          </div>
          <div className={styles.iconLabel}>{mute ? "Un-Mute" : "Mute"}</div>
        </button>
        <button
          type="button"
          className={styles.iconGroup}
          onClick={handleSearch}
        >
          <div className={styles.iconWrapper}>
            <IconUtil icon={"search"} height={24} width={24} />
          </div>
          <div className={styles.iconLabel}>Search</div>
        </button>

        {isShowScheduleVideoCallModal && (
          <ScheduleVideoModal
            isOpen={isShowScheduleVideoCallModal}
            onRequestClose={() => setIsShowScheduleVideoCallModal(false)}
            onConfirm={onScheduleVideoCall}
          />
        )}
      </div>
    );
  };

  const DisplayUserActionAccordion = () => {
    return (
      <ul className={styles.actionAccordionSection}>
        <li>
          <button type="button" className={styles.accordionItem}>
            <IconUtil
              width={18}
              height={18}
              icon={"folder"}
              className={styles.accordionItemIcon}
            />
            <p className={styles.accordionItemTitle}>
              All Shared Media, Links, Docs
            </p>
            <span className={styles.right}>
              <IconUtil
                width={18}
                height={18}
                icon={"chevronRight"}
                className={styles.accordionItemIcon}
              />
            </span>
          </button>
        </li>
      </ul>
    );
  };

  const DisplayMemberRequests = () => {
    const displayMemberStepper = (member: IMember) => {
      return (
        <div
          key={`member-see-all-${member.user.id}`}
          className={classNames(styles.center, styles.column)}
        >
          <Avatar
            src={member.user.picture}
            firstName={member.user.firstName}
            lastName={member.user.lastName}
            size={"xs"}
            showOnlineStatus={true}
            isOnline={member.user.online}
            className={styles.center}
          />
          <span>{member.user.firstName}</span>
          <div className={classNames(styles.pad10)}>
            <span>
              <IconUtil icon={"minus"} />
            </span>
            <span className={classNames(styles.stepperPlus)}>
              <IconUtil icon={"plus"} />
            </span>
          </div>
        </div>
      );
    };

    return (
      <>
        <div
          className={classNames(
            styles.row,
            styles.margin2remTop,
            styles.margin2remBottom
          )}
        >
          {channelMembers
            ?.slice(0, 3)
            ?.map((member) => displayMemberStepper(member))}
        </div>
        <div className={classNames(styles.row, styles.click)}>
          <span>{channelMembers?.length} members</span>
          <span
            onClick={handleSeeAllAndManageMembers}
            className={classNames(styles.textColorRed)}
          >
            {isGroupChannel ? "Manage" : isTopicChannel ? "See All" : ""}
          </span>
        </div>
      </>
    );
  };

  const DisplayGroupMembers = () => {
    const Member = ({ member }: { member: IMember }) => {
      return (
        <li
          key={`member-see-all-${member?.user?.id}`}
          className={styles.groupListItem}
        >
          <Avatar
            src={member?.user?.picture}
            firstName={member?.user?.firstName}
            lastName={member?.user?.lastName}
            size={"s"}
            showOnlineStatus={true}
            isOnline={member?.user?.online}
          />
          <p className={styles.memberName}>{member?.user?.firstName}</p>
        </li>
      );
    };

    return (
      <div className={styles.groupListSection}>
        <div className={styles.groupHeader}>
          <p className="smallHeader">{channelMembers?.length} Members</p>
          <TextButton onClick={handleSeeAllAndManageMembers}>
            See All
          </TextButton>
        </div>
        <ul className={styles.groupList}>
          {channelMembers?.slice(0, 4)?.map((member: IMember) => (
            <Member key={member?.user?.id} member={member} />
          ))}
        </ul>
      </div>
    );
  };

  const DisplayBottomActions = () => {
    return (
      <ul className={styles.bottomActionSection}>
        <li>
          <button
            type="button"
            className={styles.bottomActionItem}
            onClick={handleArchiveConversation}
          >
            <IconUtil
              width={18}
              height={18}
              icon={"trash"}
              className={styles.bottomActionItemIcon}
            />
            <p className={styles.accordionItemTitle}>Archive Conversation</p>
          </button>
        </li>
      </ul>
    );
  };

  // TODO: Update so it can handle removing users as well
  const handleGroupInviteOnConfirm = async (ids: string[]) => {
    try {
      await messageService.inviteToChannel({
        channelRef: channel?.id,
        members: ids,
      });
      showSuccessMessage({
        title: Enum.groupInvite.successTitle,
        message: Enum.groupInvite.successMessage,
      });
      setIsShowInviteMembers(false);
    } catch (err: any) {
      showErrorMessage({
        title: Enum.groupInvite.errorTitle,
        message: Enum.groupInvite.errorMessage,
      });
    }
    setIsShowInviteMembers(false);
  };

  const overlayProps = {
    onClose: handleOverlayClose,
    searchText: searchInput,
    onChangeSearchInput: setSearchInput,
  };
  return (
    <>
      <div className={classNames(styles.container)}>
        {showOverlayByType === "" && (
          <>
            <FlyoutHeader />
            {!isGroupChannel && !isTopicChannel && <UserDisplayOneToOne />}
            {isGroupChannel && <UserDisplayGroup />}
            {isTopicChannel && <UserDisplayTopic />}
            <DisplayUserActionLinks />
            {isGroupChannel && <DisplayGroupMembers />}
            {isTopicChannel && <DisplayMemberRequests />}
            <DisplayUserActionAccordion />
            <DisplayBottomActions />
          </>
        )}
        {showOverlayByType === Enum.OverlayEnum.search && (
          <SearchChatOverlay {...overlayProps} />
        )}
        {showOverlayByType === Enum.OverlayEnum.seeAllMembers && (
          <SeeAllMembersOverlay {...overlayProps} />
        )}
        {isShowInviteMembers && (
          <GroupInviteUserAddModal
            isOpen={isShowInviteMembers}
            onConfirm={handleGroupInviteOnConfirm}
            onRequestClose={() => setIsShowInviteMembers(false)}
          />
        )}
      </div>
    </>
  );
});
export default React.memo(ConversationFlyout);
