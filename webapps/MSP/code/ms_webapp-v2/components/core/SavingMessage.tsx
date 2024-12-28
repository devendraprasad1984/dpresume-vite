import { observer } from "mobx-react-lite";

import styles from "./SavingMessage.module.scss";
import CheckFilledIcon from "../../public/static/icons/CheckFilled.svg";

interface Props {
  isSaving: boolean;
}

export const SavingMessage = observer(({ isSaving }: Props) => {
  return (
    <div className={styles.base}>
      {isSaving === true && <span className={styles.text}>Saving...</span>}
      {isSaving === false && (
        <>
          <CheckFilledIcon className={styles.icon} width={18} height={18} />
          <span className={styles.text}>Saved</span>
        </>
      )}
    </div>
  );
});
