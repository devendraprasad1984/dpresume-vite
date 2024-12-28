import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";

import styles from "./Session.module.scss";
import Room from "../../twilio/components/Room";
import MenuBar from "../../twilio/components/MenuBar";
import useIsRecording from "../../twilio/hooks/useIsRecording";
import useToast from "../../hooks/use-toast";
import useRoomState from "../../twilio/hooks/useRoomState";
import MobileTopMenuBar from "../../twilio/components/MobileTopMenuBar";

const Session = observer(() => {
  const { showSuccessMessage, showErrorMessage } = useToast();
  const isRecording = useIsRecording();
  const prevIsRecording = useRef<boolean | null>(null);
  const roomState = useRoomState();
  const prevRoomState = useRef<string | null>(null);

  useEffect(() => {
    // Show "Recording in progress" when a user joins a room that is recording
    if (isRecording && prevIsRecording.current === null) {
      showSuccessMessage({ title: "Recording is in progress." });
    }
  }, [isRecording, showSuccessMessage]);

  useEffect(() => {
    // Show "Recording started" when recording has started.
    if (isRecording && prevIsRecording.current === false) {
      showSuccessMessage({ title: "Recording has started." });
    }
  }, [isRecording, showSuccessMessage]);

  useEffect(() => {
    // Show "Recording finished" when recording has stopped.
    if (!isRecording && prevIsRecording.current === true) {
      showSuccessMessage({ title: "Recording is stopped." });
    }
  }, [isRecording, showSuccessMessage]);

  useEffect(() => {
    // Show "Reconnecting to room" when user disconnects
    if (
      roomState === "reconnecting" &&
      prevRoomState.current !== "reconnecting"
    ) {
      showErrorMessage({ title: "Reconnecting to room..." });
    }
  }, [roomState, showErrorMessage]);

  useEffect(() => {
    prevIsRecording.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    prevRoomState.current = roomState;
  }, [roomState]);

  return (
    <div className={styles.container}>
      <MobileTopMenuBar />
      <Room />
      <MenuBar />
    </div>
  );
});

export default Session;
