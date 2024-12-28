import styles from "./AnimatedLoadingPill.module.scss";

export const AnimatedLoadingPill = () => {
  return (
    <svg
      width="232"
      height="142"
      viewBox="0 0 232 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={styles.track}
        d="M161,126H71c-30.38,0-55-24.62-55-55v0c0-30.38,24.62-55,55-55h90c30.38,0,55,24.62,55,55v0
	C216,101.38,191.38,126,161,126z"
      />
      <path
        className={styles.dot}
        d="M161,16H71c-30.38,0-55,24.62-55,55v0c0,30.38,24.62,55,55,55h90c30.38,0,55-24.62,55-55v0C216,40.62,191.38,16,161,16H71"
      />
    </svg>
  );
};
