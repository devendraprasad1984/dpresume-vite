import React, { ReactElement, ReactNode } from "react";
import Modal from "react-modal";

import ModalHeader from "./ModalHeader";
import pxToRem from "../../utils/px-to-rem";

const customStyles = {
  overlay: {
    backgroundColor: "hsla(247, 22%, 15%, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: `${pxToRem(34)} ${pxToRem(36)}`,
    maxWidth: "95%",
    border: "0",
    overflow: "auto",
    borderRadius: pxToRem(34),
  },
};

interface Input {
  children?: ReactNode;
  title?: string;
  subTitle?: string;
  isOpen: boolean;
  width?: string;
  shouldCloseOnOverlayClick?: boolean;
  onRequestClose: () => void;
}

const BaseModal = ({
  children,
  title,
  isOpen = false,
  width = pxToRem(624),
  onRequestClose,
  shouldCloseOnOverlayClick = true,
}: Input): ReactElement => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      style={{
        ...customStyles,
        content: {
          ...customStyles.content,
          width,
        },
      }}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
    >
      <ModalHeader title={title} onRequestClose={onRequestClose} />
      {children}
    </Modal>
  );
};

export default BaseModal;
