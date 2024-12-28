import React, { useState } from "react";

import { observer } from "mobx-react-lite";
import OverlayContainer from "./OverlayContainer";
import Search from "../../core/Search";
import InviteGroupModal from "../../conversation/InviteGroupModal";
import GroupInviteUserAddModal from "../../conversation/GroupInviteUserAddModal";
import useToast from "../../../hooks/use-toast";
import { useChatContext } from "stream-chat-react";
import messageService from "../../../services/message-service";
import styles from "./OverlayContainer.module.scss";
import IconButton from "../../buttons/IconButton";
import GroupMemberList from "./GroupMemberList";
import { Enum } from "../utils";
import useConversationHelper from "../use-conversion-helper";

interface Props {
  onClose?: () => void;
  searchText: string;
  onChangeSearchInput: (val: string) => void;
}

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

const SeeAllMembersOverlay = ({
  onClose,
  searchText,
  onChangeSearchInput,
}: Props) => {
  const { channel } = useChatContext();
  const { channelMembers } = useConversationHelper();

  const { showSuccessMessage, showErrorMessage } = useToast();
  const [inviteModal, setInviteModal] =
    useState<IModalInvitePopup>(inviteInitVals);
  const [groupUserAddShow, setGroupUserAddShow] = useState<boolean>(false);

  const hideModal = () => {
    setInviteModal(inviteInitVals);
  };

  const handleGroupUserAdd = () => {
    setGroupUserAddShow(true);
  };

  const handleGroupUserInviteClose = () => {
    setGroupUserAddShow(false);
  };

  const handleOnConfirmInvite = async (ids: string[]) => {
    try {
      await messageService.inviteToChannel({
        channelRef: channel?.id,
        members: ids,
      });
      showSuccessMessage({
        title: Enum.groupInvite.successTitle,
        message: Enum.groupInvite.successMessage,
      });
      setGroupUserAddShow(false);
    } catch (err: any) {
      showErrorMessage({
        title: Enum.groupInvite.errorTitle,
        message: Enum.groupInvite.errorMessage,
      });
    }
    setGroupUserAddShow(false);
  };

  return (
    <OverlayContainer onClose={onClose} title={"Group Members"}>
      <div>
        <div className={styles.searchSection}>
          <Search onChange={onChangeSearchInput} leftOffset={true} />
        </div>
        <div className={styles.memberCountAndInvite}>
          <p className="smallHeader">{channelMembers?.length} Members</p>
          {channel?.state?.membership?.role === "channel_moderator" &&
            channelMembers?.length > 2 && (
              <IconButton
                label="Add new user"
                kind="primary"
                icon="peoplePlus"
                size={40}
                iconSize={22}
                onClick={handleGroupUserAdd}
              />
            )}
        </div>
        <GroupMemberList searchText={searchText} />

        {inviteModal.show && (
          <InviteGroupModal
            title={inviteModal.title}
            body={inviteModal.body}
            isOpen={inviteModal.show}
            onConfirm={inviteModal.onConfirm}
            onRequestClose={hideModal}
          />
        )}
        {groupUserAddShow && (
          <GroupInviteUserAddModal
            isOpen={groupUserAddShow}
            onConfirm={handleOnConfirmInvite}
            onRequestClose={handleGroupUserInviteClose}
          />
        )}
      </div>
    </OverlayContainer>
  );
};

export default observer(SeeAllMembersOverlay);
