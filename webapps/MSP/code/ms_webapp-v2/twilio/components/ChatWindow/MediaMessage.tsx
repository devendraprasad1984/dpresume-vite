import React from "react";
import { Media } from "@twilio/conversations";

import Download from "../../../public/static/icons/Download.svg";
import styles from "./MediaMessage.module.scss";

interface MediaMessageProps {
  media: Media;
}

export function formatFileSize(bytes: number, suffixIndex = 0): string {
  const suffixes = ["bytes", "KB", "MB", "GB"];
  if (bytes < 1000) return +bytes.toFixed(2) + " " + suffixes[suffixIndex];
  return formatFileSize(bytes / 1024, suffixIndex + 1);
}

export default function FileMessage({ media }: MediaMessageProps) {
  const handleClick = () => {
    media.getContentTemporaryUrl().then((url) => {
      const anchorEl = document.createElement("a");

      anchorEl.href = url;
      anchorEl.target = "_blank";
      anchorEl.rel = "noopener";

      // setTimeout is needed in order to open files in iOS Safari.
      setTimeout(() => {
        anchorEl.click();
      });
    });
  };

  return (
    <div className={styles.messageContainer} onClick={handleClick}>
      <div className={styles.iconContainer}>
        <Download />
      </div>
      <div className={styles.mediaInfo}>
        <p className={styles.filename}>{media.filename}</p>
        <p className={styles.size}>
          {formatFileSize(media.size)} - Click to open
        </p>
      </div>
    </div>
  );
}
