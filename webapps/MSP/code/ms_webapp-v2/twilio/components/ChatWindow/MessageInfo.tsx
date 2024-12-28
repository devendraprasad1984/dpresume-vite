import React from "react";

import styles from "./MessageInfo.module.scss";

interface MessageInfoProps {
  author: string;
  dateCreated: string;
  isLocalParticipant: boolean;
}

export default function MessageInfo({
  author,
  dateCreated,
  isLocalParticipant,
}: MessageInfoProps) {
  return (
    <div className={styles.messageInfoContainer}>
      <div>{isLocalParticipant ? `${author} (You)` : author}</div>
      <div>{dateCreated}</div>
    </div>
  );
}
