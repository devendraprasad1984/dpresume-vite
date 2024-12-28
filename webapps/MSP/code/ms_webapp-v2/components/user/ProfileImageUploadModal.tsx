import React, { ReactElement, useCallback, useState } from "react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import ProfileImageCropper from "./ProfileImageCropper";
import { IMediaCrop } from "../../@types/Media";

type Input = {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: ({ image: File, crop: IMediaCrop }) => void;
};

const ProfileImageUploadModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [imageFile, setImageFile] = useState<File>();
  const [cropData, setCropData] = useState<IMediaCrop>();
  const onCropChange = useCallback(
    ({ file, crop }: { file: File; crop: IMediaCrop }) => {
      setImageFile(file);
      setCropData(crop);
    },
    []
  );

  const confirm = () => {
    onConfirm({
      image: imageFile,
      crop: cropData,
    });
  };

  return (
    <BaseModal
      title="Profile Picture Upload"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <ProfileImageCropper
          onChange={onCropChange}
          recommendedResolution={[800, 800]}
        />
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={confirm}>Confirm</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ProfileImageUploadModal;
