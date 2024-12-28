import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./Avatars.module.scss";
import Avatar, { AvatarSize } from "./Avatar";

const sizes = {
  s: 57,
  l: 112,
};

const avatarSizes = {
  s: "xxs",
  l: "l",
};

interface Props {
  size: "s" | "l";
  withBorder?: boolean;
  showOnlineStatus?: boolean;
  avatars: {
    src?: string;
    alt?: string;
    firstName?: string;
    lastName?: string;
    isOnline?: boolean;
  }[];
  totalCount?: number;
  className?: string;
}

const Avatars = observer(
  ({
    size,
    withBorder = false,
    showOnlineStatus = false,
    avatars,
    totalCount = 2,
  }: Props) => {
    return (
      <div
        className={styles.container}
        style={{ width: sizes[size], height: sizes[size] }}
      >
        <Avatar
          src={avatars[0]?.src}
          firstName={avatars[0].firstName}
          lastName={avatars[0].lastName}
          size={avatarSizes[size] as AvatarSize}
          isOnline={avatars[0].isOnline}
          showOnlineStatus={showOnlineStatus}
          withBorder={withBorder}
          className={classNames(
            styles.firstAvatar,
            size === "s" && styles.firstAvatarSmall,
            size === "l" && styles.firstAvatarLarge
          )}
        />
        <Avatar
          src={avatars[1]?.src}
          firstName={avatars[1].firstName}
          lastName={avatars[1].lastName}
          size={avatarSizes[size] as AvatarSize}
          isOnline={avatars[1].isOnline}
          showOnlineStatus={showOnlineStatus}
          withBorder={withBorder}
          className={classNames(
            styles.secondAvatar,
            size === "s" && styles.secondAvatarSmall,
            size === "l" && styles.secondAvatarLarge
          )}
        />
        <div
          className={classNames(
            styles.totalCount,
            size === "s" && styles.totalCountSmall,
            size === "l" && styles.totalCountLarge
          )}
        >
          {totalCount - 2}
        </div>
      </div>
    );
  }
);

export default Avatars;
