import React from "react";
import classNames from "classnames";

import styles from "./BackgroundThumbnail.module.scss";
import useVideoContext from "../hooks/useVideoContext";
import Slash from "../../public/static/icons/Slash.svg";
import BlurOn from "../../public/static/icons/BlurOn.svg";

export type Thumbnail = "none" | "blur" | "image";

interface BackgroundThumbnailProps {
  thumbnail: Thumbnail;
  imagePath?: string;
  name?: string;
  index?: number;
}

const BackgroundThumbnail = ({
  thumbnail,
  imagePath,
  name,
  index,
}: BackgroundThumbnailProps) => {
  const { backgroundSettings, setBackgroundSettings } = useVideoContext();
  const isImage = thumbnail === "image";
  const thumbnailSelected = isImage
    ? backgroundSettings.index === index && backgroundSettings.type === "image"
    : backgroundSettings.type === thumbnail;
  const icons = {
    none: Slash,
    blur: BlurOn,
    image: null,
  };
  const ThumbnailIcon = icons[thumbnail];

  return (
    <div
      className={styles.thumbContainer}
      onClick={() =>
        setBackgroundSettings({
          type: thumbnail,
          index: index,
        })
      }
    >
      {ThumbnailIcon ? (
        <div
          className={classNames(
            styles.thumbIconContainer,
            thumbnailSelected && styles.selectedThumbIconContainer
          )}
        >
          <ThumbnailIcon
            className={classNames(
              styles.thumbIcon,
              thumbnailSelected && styles.selectedThumbIcon
            )}
          />
        </div>
      ) : (
        <img
          className={classNames(
            styles.thumbImage,
            thumbnailSelected && styles.selectedImage
          )}
          src={imagePath}
          alt={name}
        />
      )}
      <div className={styles.thumbOverlay}>{name}</div>
    </div>
  );
};

export default BackgroundThumbnail;
