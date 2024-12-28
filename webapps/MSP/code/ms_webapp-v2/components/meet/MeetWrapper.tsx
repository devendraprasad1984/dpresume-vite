import React, { ReactNode, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { VideoProvider } from "../../twilio/components/VideoProvider";
import { useAppState } from "../../twilio/state";
import useConnectionOptions from "../../twilio/utils/useConnectionOptions";
import useToast from "../../hooks/use-toast";

interface Props {
  children: ReactNode;
}

const MeetWrapper = observer(({ children }: Props) => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();
  const { showErrorMessage } = useToast();

  useEffect(() => {
    if (error) {
      showErrorMessage({ title: "Error", message: error?.message });
    }
  }, [showErrorMessage, error]);

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      {children}
    </VideoProvider>
  );
});

export default MeetWrapper;
