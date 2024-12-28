import styles from "./MiniRingLoader.module.scss";

export const MiniRingLoader = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(11,11)">
        <circle className={styles.track} cx="0" cy="0" r="8" />
      </g>
      <circle className={styles.dot} cx="11" cy="11" r="7.5" />
    </svg>
  );
};
