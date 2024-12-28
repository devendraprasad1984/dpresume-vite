import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { MessageInput, MessageList, useChatContext } from "stream-chat-react";

import styles from "./ConversationChannel.module.scss";
import ChannelHeader from "../stream/ChannelHeader";
import CustomStreamMessage from "../stream/CustomStreamMessage";
import CustomStreamInput from "../stream/CustomStreamInput";
import ConversationFlyout from "../stream/ConversationFlyout";
import { CustomStreamThread } from "../stream/CustomStreamThread";
import Icon from "../core/Icon";
import Hi from "../../public/static/icons/Hi.svg";
import ContainedButton from "../buttons/ContainedButton";
import OutlineButton from "../buttons/OutlineButton";
import useConversationHelper from "../stream/use-conversion-helper";

const ConversationChannel = observer(() => {
  const { channel } = useChatContext();

  const {
    anotherMember,
    hasAnotherMemberAcceptedInvite,
    hasUserMemberAcceptedInvite,
  } = useConversationHelper();

  const [isShowInformationModalOpen, setIsShowInformationModalOpen] =
    useState(false);

  const onShowInformation = () => {
    setIsShowInformationModalOpen(!isShowInformationModalOpen);
  };

  const commonPropsToChannelHeaderAndFlyout = {
    onShowInformation: onShowInformation,
    isShowInfo: isShowInformationModalOpen,
  };

  const onAcceptInvite = () => {
    channel.acceptInvite();
  };

  const onRejectInvite = () => {
    channel.rejectInvite();
  };

  return (
    <>
      <div className={styles.primarySection}>
        <ChannelHeader {...commonPropsToChannelHeaderAndFlyout} />
        <div className={styles.channelConversationSection}>
          {hasAnotherMemberAcceptedInvite === false && (
            <div className={styles.pendingSentInviteNotice}>
              <Icon size={29} iconSize={16} icon="infoFilled" label="Info" />
              Your connection request is pending.
            </div>
          )}
          {hasUserMemberAcceptedInvite === false && (
            <div className={styles.receivedInviteNotice}>
              <Hi width={45} height={40} />
              <div>
                <p className={styles.receivedInviteTitle}>
                  You have a new connection request
                </p>
                <p className={styles.receivedInviteSubTitle}>
                  Accept {anotherMember?.user?.fullName}’s request to reply
                </p>
              </div>
              <div className={styles.receivedInviteNoticeActions}>
                <OutlineButton onClick={onRejectInvite}>Ignore</OutlineButton>
                <ContainedButton onClick={onAcceptInvite}>
                  Accept
                </ContainedButton>
              </div>
            </div>
          )}
          <MessageList
            Message={CustomStreamMessage}
            messageActions={["react", "reply", "edit", "delete"]}
          />
          <MessageInput Input={CustomStreamInput} grow={true} />
          <CustomStreamThread />
        </div>
      </div>
      {isShowInformationModalOpen && (
        <ConversationFlyout {...commonPropsToChannelHeaderAndFlyout} />
      )}
    </>
  );
});

export default ConversationChannel;
