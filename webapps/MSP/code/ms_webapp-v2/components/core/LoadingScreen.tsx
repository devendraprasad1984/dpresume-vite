import React, { useRef } from "react";

import styles from "./LoadingScreen.module.scss";

const LoadingScreen = () => {
  const ref = useRef(null);
  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <div className={styles.container}>
      <lottie-player
        id="loadingAnimation"
        ref={ref}
        autoplay
        loop
        mode="normal"
        src="/static/loading.json"
        style={{ width: "100vw", height: "100vh" }}
        preserveAspectRatio="xMidYMid slice"
      />
    </div>
  );
};

export default LoadingScreen;
