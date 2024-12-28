import React from "react";
import { observer } from "mobx-react-lite";

import styles from "./VideoCallMessage.module.scss";
import fullName from "../../utils/full-name";
import { CustomStreamData } from "../../@types/Conversation";
import ContainedLinkButton from "../buttons/ContainedLinkButton";

interface Props {
  customData: CustomStreamData;
}

const VideoCallMessage = observer(({ customData }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.subTitle}>New Video Call</div>
      <div className={styles.title}>
        {fullName([
          customData?.createdBy?.firstName,
          customData?.createdBy?.lastName,
        ])}{" "}
        started a new video call
      </div>
      <div className={styles.joinButton}>
        <ContainedLinkButton href={`/ms/meet/${customData.roomId}`}>
          Join Video Call
        </ContainedLinkButton>
      </div>
    </div>
  );
});

export default VideoCallMessage;
