import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import * as utils from "../utils";
import { IMember } from "../../../@types/Conversation";
import MoreActions from "../../core/MoreActions";
import IconsUtil from "../../core/IconsUtil";
import useToast from "../../../hooks/use-toast";
import Avatar from "../../core/Avatar";
import { useChatContext } from "stream-chat-react";
import messageService from "../../../services/message-service";
import styles from "./OverlayContainer.module.scss";
import UserProfileName from "../../core/UserProfileName";
import IconButton from "../../buttons/IconButton";
import useUserLogic from "../../../hooks/use-user-logic";
import useConversationHelper from "../use-conversion-helper";

interface IModalInvitePopup {
  title: string;
  body: string;
  show: boolean;
  onConfirm?: () => void;
}

const inviteInitVals: IModalInvitePopup = {
  title: "",
  body: "",
  show: false,
  onConfirm: undefined,
};

interface Props {
  searchText: string;
}

const GroupMemberList = ({ searchText }: Props) => {
  const { channel } = useChatContext();
  const { onConnect, onMessage } = useUserLogic();
  const { showSuccessMessage, showErrorMessage, showServerError } = useToast();
  const { getMemberName, channelRef, allChannelMembers } =
    useConversationHelper();
  const [inviteModal, setInviteModal] =
    useState<IModalInvitePopup>(inviteInitVals);

  const removeMemberFromChannel = async (ids: string[]) => {
    try {
      await messageService.removeFromChannel({
        channelRef: channel?.id,
        members: ids,
      });
      showSuccessMessage({
        title: "Removed from Channel",
      });
      setInviteModal({ ...inviteModal, show: false });
    } catch (err) {
      showErrorMessage({
        title: "Removed from Channel",
      });
      setInviteModal({ ...inviteModal, show: false });
    }
  };

  const onAddConnection = async (ref: string, name: string) => {
    try {
      await onConnect({ ref, name });
    } catch (error) {
      showServerError(error);
    }
  };

  const onNewMessage = async () => {
    onMessage(channelRef);
  };

  return (
    <ul>
      {allChannelMembers
        ?.filter((member) => {
          const { firstName, lastName, pronouns, headline, companyHeadline } =
            member?.user;
          const lookIntoText = [
            firstName,
            lastName,
            pronouns,
            headline,
            companyHeadline,
          ]
            .join(" ")
            .toLowerCase();
          if (lookIntoText.indexOf(searchText.toLowerCase()) !== -1)
            return true;
          else return false;
        })
        .map((member) => (
          <li key={member.user.id} className={styles.memberLineSection}>
            <div className={styles.memberLine}>
              <Avatar
                src={member?.user?.picture}
                firstName={member?.user?.firstName}
                lastName={member?.user?.lastName}
                size={"l"}
                showOnlineStatus={true}
                isOnline={member?.user?.online}
              />
              <div className={styles.memberDetails}>
                <UserProfileName
                  mode="listItem"
                  firstName={member?.user?.firstName}
                  lastName={member?.user?.lastName}
                  pronouns={member.user.pronouns}
                />
                <span>
                  {member.user.role !== "user" && (
                    <p className={styles.groupModeratorName}>
                      <IconsUtil icon={"crown"} /> Group Moderator
                    </p>
                  )}
                  <p className={styles.headline}>{member.user.headline}</p>
                  <p className={styles.companyHeadline}>
                    {member.user.companyHeadline}
                  </p>
                </span>
              </div>
            </div>
            <div>
              {channel?.state?.membership?.role === "channel_moderator" && (
                <MoreActions
                  id={`channel-actions-${member?.user?.id}`}
                  actions={[
                    {
                      key: "newMessage",
                      name: `New Message`,
                      icon: "messageEdit",
                      onClick: () => onNewMessage(),
                    },
                    {
                      key: "addConnection",
                      name: `Add Connection`,
                      icon: "peoplePlus",
                      hideIf: [{ key: "connected", value: false }],
                      onClick: () =>
                        onAddConnection(
                          member?.user?.id,
                          member?.user?.fullName
                        ),
                    },
                    {
                      key: "remove-connection",
                      name: `Remove`,
                      icon: "trash",
                      onClick: (member: IMember) => {
                        const name = getMemberName(member);
                        const { title, body } =
                          utils.Enum.ModalMessages.group.removeFromGroup(name);
                        setInviteModal({
                          title,
                          body,
                          show: true,
                          onConfirm: () => {
                            removeMemberFromChannel([member.user.id]);
                          },
                        });
                      },
                    },
                  ]}
                />
              )}
              {channel?.state?.membership?.role !== "channel_moderator" && (
                <IconButton
                  size={28}
                  iconSize={16}
                  icon="groupMemberChatEdit"
                  label="Start New Message"
                  kind="filled"
                  onClick={() => onNewMessage()}
                  disabled={false}
                />
              )}
            </div>
          </li>
        ))}
    </ul>
  );
};

export default observer(GroupMemberList);
