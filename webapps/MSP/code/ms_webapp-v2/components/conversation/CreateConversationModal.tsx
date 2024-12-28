import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import ContainedButton from "../buttons/ContainedButton";
import UserSelector from "../user/UserSelector";
import useToast from "../../hooks/use-toast";
import messageService from "../../services/message-service";
import useAppStores from "../../stores/app-context";
import { IPeopleSearchForUI } from "../../@types/Users";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateConversationModal = ({
  isOpen,
  onRequestClose,
}: Props): ReactElement => {
  const { appStore } = useAppStores();
  const [members, setMembers] = useState<IPeopleSearchForUI[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { showServerError, showSuccessMessage } = useToast();

  const onConfirm = async () => {
    setIsSaving(true);

    try {
      const memberNames = [
        appStore?.user?.basicInfo?.firstName,
        ...members?.slice(0, 5)?.map((item) => item?.firstName),
      ]?.join(", ");
      const memberRefs = members?.map((item) => item?.ref);
      const res = await messageService.createChannel({
        members: [appStore?.user?.user?.ref, ...memberRefs],
        name: memberNames,
      });

      showSuccessMessage({
        title: "Conversation Created",
        message: "Your new conversation is successfully created.",
      });

      router
        .push(`/ms/conversations/?${res?.ref}`)
        .then(() => window.scrollTo(0, 0));
      onRequestClose();
    } catch (e) {
      showServerError(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      title={"Create New Conversation"}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
    >
      <ModalContent>
        <UserSelector
          idType="user"
          onSelect={(users: IPeopleSearchForUI[]) => {
            setMembers(users);
          }}
          filter={"connectedWithMe"}
          showMeOnTop={true}
        />
      </ModalContent>
      <ModalFooter>
        <ContainedButton onClick={onConfirm} disabled={isSaving}>
          Create Conversation
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};
export default CreateConversationModal;
