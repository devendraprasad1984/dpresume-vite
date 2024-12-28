import styles from "./LoadingOverlay.module.scss";
import { AnimatedLoadingPill } from "./AnimatedLoadingPill";

export const LoadingOverlay = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loaderWrapper}>
        <AnimatedLoadingPill />
      </div>
      <div className={styles.backdrop}></div>
    </div>
  );
};
