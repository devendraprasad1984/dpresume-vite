import React from "react";
import Modal from "react-modal";
import { config, getRandomColor } from "../../configs/config";

Modal.setAppElement("#rootModal");
const BaseModal = (props) => {
  const { isOpen, onClose, afterOpenModal, title } = props;
  const { children } = props;

  const randomColor = getRandomColor();
  let subtitle;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={onClose}
        contentLabel={title}
        ariaHideApp={false}
      >
        <div
          className="size30 pad5"
          style={{ backgroundColor: randomColor }}
          ref={(_subtitle) => (subtitle = _subtitle)}
        >
          <div className="row">
            <span>{title}</span>
            <button onClick={onClose}>{config.chars.close}</button>
          </div>
        </div>

        {children}
      </Modal>
    </>
  );
};

export default BaseModal;
