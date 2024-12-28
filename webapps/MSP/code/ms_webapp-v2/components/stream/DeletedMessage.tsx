import React from "react";
import { observer } from "mobx-react-lite";
import Trash from "../../public/static/icons/Trash.svg";

import styles from "./DeletedMessage.module.scss";

const DeletedMessage = observer(() => {
  return (
    <div className={styles.container}>
      <Trash className={styles.icon} width={18} height={18} />
      <span>Message deleted</span>
    </div>
  );
});

export default DeletedMessage;
