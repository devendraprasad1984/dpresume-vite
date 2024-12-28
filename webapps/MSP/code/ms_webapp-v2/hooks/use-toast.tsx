import React, { useCallback } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { ToastContent } from "../components/core/Toast";

const useToast = () => {
  const showSuccessMessage = useCallback(
    ({ title, message }: { title: string; message?: string }) => {
      toast(<ToastContent title={title} message={message} type={"success"} />);
    },
    []
  );

  const showErrorMessage = useCallback(
    ({ title, message }: { title: string; message?: string }) => {
      toast(<ToastContent title={title} message={message} type={"error"} />);
    },
    []
  );

  const showServerError = useCallback((error: AxiosError) => {
    console.error(error);

    // @ts-ignore
    if (error?.response?.data?.message) {
      toast(
        <ToastContent
          title={"Error Saving"}
          // @ts-ignore
          message={error?.response?.data?.message}
          type={"error"}
        />
      );
    }
  }, []);

  return {
    showSuccessMessage,
    showErrorMessage,
    showServerError,
  };
};

export default useToast;
