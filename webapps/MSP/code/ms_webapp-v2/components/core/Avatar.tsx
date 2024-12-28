import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./Avatar.module.scss";
import pxToRem from "../../utils/px-to-rem";

export type AvatarSize = "xxs" | "xs" | "s" | "l" | "xl" | "xxl";

interface Props {
  src?: string;
  size: AvatarSize;
  alt?: string;
  firstName?: string;
  lastName?: string;
  withBorder?: boolean;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizes = {
  xxs: 36,
  xs: 48,
  s: 57,
  l: 68,
  xl: 112,
  xxl: 196,
};

const indicatorSizes = {
  xxs: {
    innerCircle: 6,
    outerCircle: 6 + 1.5 * 2,
  },
  xs: {
    innerCircle: 8,
    outerCircle: 8 + 1.5 * 2,
  },
  s: {
    innerCircle: 9,
    outerCircle: 10 + 2 * 2,
  },
  l: {
    innerCircle: 12,
    outerCircle: 14 + 3 * 2,
  },
  xl: {
    innerCircle: 14,
    outerCircle: 16 + 4 * 2,
  },
  xxl: {
    innerCircle: 22,
    outerCircle: 24 + 6 * 2,
  },
};

const fontSizes = {
  xxs: 15,
  xs: 16,
  s: 18,
  l: 24,
  xl: 40,
  xxl: 72,
};

const Avatar = observer(
  ({
    src,
    size,
    alt,
    firstName,
    lastName,
    withBorder = false,
    showOnlineStatus = false,
    isOnline = false,
    className,
  }: Props) => {
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
      setImageSrc(src);
    }, [src]);

    const handleError = () => {
      setImageSrc(null);
    };

    const firstInitial = firstName?.charAt(0);
    const lastInitial = lastName?.charAt(0);

    const initials =
      firstInitial || lastInitial ? [firstInitial, lastInitial]?.join("") : "?";

    let backgroundColor = "var(--colorFrenchGrey)";
    let textColor = "var(--colorSteelGrey)";
    if (["A", "E", "I", "M", "Q", "U", "Y"].includes(firstInitial)) {
      backgroundColor = "var(--colorConfetti)";
    } else if (["B", "F", "J", "N", "R", "V", "Z"].includes(firstInitial)) {
      backgroundColor = "var(--colorJellyBean)";
      textColor = "var(--colorWhite)";
    } else if (["C", "G", "K", "O", "S", "W"].includes(firstInitial)) {
      backgroundColor = "var(--colorBlueViolet)";
      textColor = "var(--colorWhite)";
    } else if (["D", "H", "L", "P", "T", "X"].includes(firstInitial)) {
      backgroundColor = "var(--colorPlum)";
      textColor = "var(--colorWhite)";
    }

    return (
      <div
        className={classNames(
          styles.container,
          withBorder && styles.withBorder,
          className
        )}
        style={{
          width: sizes[size],
          height: sizes[size],
          backgroundColor: backgroundColor,
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
        <span
          className={styles.initialsContainer}
          style={{ fontSize: pxToRem(fontSizes[size]), color: textColor }}
        >
          {initials}
        </span>
        {showOnlineStatus && isOnline && (
          <span
            className={styles.indicatorWrapper}
            style={{
              width: indicatorSizes[size]?.outerCircle,
              height: indicatorSizes[size]?.outerCircle,
            }}
          >
            <span
              className={styles.onlineIndicator}
              style={{
                width: indicatorSizes[size]?.innerCircle,
                height: indicatorSizes[size]?.innerCircle,
              }}
            >
              <span className={"visuallyHidden"}>Online</span>
            </span>
          </span>
        )}
        {showOnlineStatus && !isOnline && (
          <span
            className={styles.indicatorWrapper}
            style={{
              width: indicatorSizes[size]?.outerCircle,
              height: indicatorSizes[size]?.outerCircle,
            }}
          >
            <span
              className={styles.offlineIndicator}
              style={{
                width: indicatorSizes[size]?.innerCircle,
                height: indicatorSizes[size]?.innerCircle,
              }}
            >
              <span className={"visuallyHidden"}>Offline</span>
            </span>
          </span>
        )}
      </div>
    );
  }
);

export default Avatar;
