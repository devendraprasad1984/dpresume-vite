import React from "react";
import classNames from "classnames";

import BackgroundSelectionHeader from "./BackgroundSelectionHeader";
import BackgroundThumbnail from "./BackgroundThumbnail";
import { backgroundConfig } from "./VideoProvider/useBackgroundSettings";
import useVideoContext from "../hooks/useVideoContext";
import styles from "./BackgroundSelectionDialog.module.scss";

const BackgroundSelectionDialog = () => {
  const { isBackgroundSelectionOpen, setIsBackgroundSelectionOpen } =
    useVideoContext();

  const imageNames = backgroundConfig.imageNames;
  const images = backgroundConfig.images;

  return (
    <div
      className={classNames(
        styles.container,
        isBackgroundSelectionOpen && styles.openContainer
      )}
    >
      <BackgroundSelectionHeader
        onClose={() => setIsBackgroundSelectionOpen(false)}
      />
      <div className={styles.thumbnailContainer}>
        <BackgroundThumbnail thumbnail={"none"} name={"None"} />
        <BackgroundThumbnail thumbnail={"blur"} name={"Blur"} />
        {images.map((image, index) => (
          <BackgroundThumbnail
            thumbnail={"image"}
            name={imageNames[index]}
            index={index}
            imagePath={image}
            key={image}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelectionDialog;
