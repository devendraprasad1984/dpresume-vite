import { toast, ToastContainer } from "react-toastify";

import CheckFilledIcon from "../../public/static/icons/CheckFilled.svg";
import AlertTriangleFilledIcon from "../../public/static/icons/AlertTriangleFilled.svg";
import InfoFilledIcon from "../../public/static/icons/InfoFilled.svg";
import AlertOctagonFilledIcon from "../../public/static/icons/AlertOctagonFilled.svg";
import X from "../../public/static/icons/X.svg";
import styles from "./Toast.module.scss";
import OutlineButton from "../buttons/OutlineButton";

export const ToastUndo = ({ onUndo }) => {
  const handleClick = () => {
    if (!onUndo) {
      console.error("Must provide an undo method");
      return;
    }
    onUndo();
  };

  return <OutlineButton onClick={handleClick}>Undo</OutlineButton>;
};

export const ToastCloseButton = ({ closeToast }) => {
  return (
    <div className={`${styles.closeButtonContainer}`} onClick={closeToast}>
      <X />
    </div>
  );
};

export const CustomToastContainer = () => {
  return (
    <ToastContainer
      toastClassName={`${styles.large}`}
      autoClose={3000}
      hideProgressBar
      icon={false}
      closeButton={ToastCloseButton}
      position={toast.POSITION.BOTTOM_RIGHT}
    />
  );
};

interface ToastContentProps {
  title?: string;
  message?: string;
  type: "success" | "warning" | "info" | "error";
  hideIcon?: boolean;
  handleUndo?: () => void;
}

export const ToastContent = ({
  title,
  message,
  type,
  hideIcon,
  handleUndo,
}: ToastContentProps) => {
  const ToastSuccessIcon = () => {
    return (
      <div className={`${styles.iconContainerSuccess}`}>
        <CheckFilledIcon />
      </div>
    );
  };

  const ToastWarningIcon = () => {
    return (
      <div className={`${styles.iconContainerWarning}`}>
        <AlertTriangleFilledIcon />
      </div>
    );
  };

  const ToastInfoIcon = () => {
    return (
      <div className={`${styles.iconContainerInfo}`}>
        <InfoFilledIcon />
      </div>
    );
  };

  const ToastErrorIcon = () => {
    return (
      <div className={`${styles.iconContainerError}`}>
        <AlertOctagonFilledIcon />
      </div>
    );
  };

  return (
    <div className={styles.toastContent}>
      <div>
        {!hideIcon && (
          <>
            {type === "success" && <ToastSuccessIcon />}
            {type === "warning" && <ToastWarningIcon />}
            {type === "info" && <ToastInfoIcon />}
            {type === "error" && <ToastErrorIcon />}
          </>
        )}
      </div>
      <div className={`${hideIcon && styles.noIconContent}`}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
      {handleUndo && (
        <div>
          <ToastUndo onUndo={handleUndo} />
        </div>
      )}
    </div>
  );
};
