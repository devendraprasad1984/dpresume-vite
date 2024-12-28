import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";

import styles from "./OrgAvatar.module.scss";
import pxToRem from "../../utils/px-to-rem";

interface Props {
  src: string;
  size: "xs" | "s" | "l" | "xl" | "xxl";
  alt?: string;
  name?: string;
}

const sizes = {
  xs: 36,
  s: 57,
  l: 68,
  xl: 112,
  xxl: 196,
};

const OrgAvatar = observer(({ src, size, alt, name }: Props) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    setImageSrc(null);
  };

  return (
    <div
      className={styles.container}
      style={{
        width: sizes[size],
        height: sizes[size],
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={sizes[size]}
          height={sizes[size]}
          className={styles.avatar}
          onError={handleError}
        />
      )}
      {!imageSrc && (
        <span
          className={styles.initialsContainer}
          style={{ fontSize: pxToRem(sizes[size] / 3.25) }}
        >
          {name?.charAt(0)}
        </span>
      )}
    </div>
  );
});

export default OrgAvatar;
