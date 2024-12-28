import React from "react";
import { observer } from "mobx-react-lite";
import { IBio } from "ms-npm/profile-models/_/bio.model";

import styles from "./UserBio.module.scss";

interface Props {
  bio: IBio;
}

const UserBio = observer(({ bio }: Props) => {
  return (
    <div className={styles.container}>
      {bio.intro && <p className={styles.bioIntro}>{bio.intro}</p>}
      {bio.text && <p className={styles.bioText}>{bio.text}</p>}
    </div>
  );
});

export default UserBio;
