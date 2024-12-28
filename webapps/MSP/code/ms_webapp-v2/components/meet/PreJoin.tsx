import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { LocalVideoTrack } from "twilio-video";
import dayjs from "dayjs";

import styles from "./PreJoin.module.scss";
import ActiveLink from "../core/ActiveLink";
import Logo from "../../public/static/Logo.svg";
import useAppStores from "../../stores/app-context";
import Avatar from "../core/Avatar";
import VideoTrack from "../../twilio/components/VideoTrack";
import ToggleAudioButton from "../../twilio/components/ToggleAudioButton";
import ToggleVideoButton from "../../twilio/components/ToggleVideoButton";
import { useAppState } from "../../twilio/state";
import useVideoContext from "../../twilio/hooks/useVideoContext";
import DeviceSelectionDialog from "../../twilio/components/DeviceSelectionDialog/DeviceSelectionDialog";
import ContainedButton from "../buttons/ContainedButton";
import OutlineButton from "../buttons/OutlineButton";
import ContainedLinkButton from "../buttons/ContainedLinkButton";

const PreJoin = observer(() => {
  const { meetStore, appStore } = useAppStores();
  const { getToken, isFetching } = useAppState();
  const {
    connect: videoConnect,
    isAcquiringLocalTracks,
    isConnecting,
    localTracks,
    getAudioAndVideoTracks,
  } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;
  const [deviceSettingsOpen, setDeviceSettingsOpen] = useState(false);

  const videoTrack = localTracks.find(
    (track) => !track.name.includes("screen") && track.kind === "video"
  ) as LocalVideoTrack;

  const handleJoin = () => {
    getToken(meetStore?.roomId).then(({ token }) => {
      videoConnect(token);
    });
  };

  useEffect(() => {
    getAudioAndVideoTracks().catch((error) => {
      console.log("Error acquiring local media:");
      console.dir(error);
    });
  }, [getAudioAndVideoTracks]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <ActiveLink href="/">
              <Logo className={styles.logo} />
            </ActiveLink>
          </div>
        </div>
        <main className={styles.main}>
          {meetStore?.room?.status === "completed" && (
            <div className={styles.endedScreen}>
              <h1 className={styles.roomName}>This meeting has been ended</h1>
              <p className={styles.joinText}>
                The meeting was originally created on{" "}
                {dayjs(meetStore?.room?.audit?.createdOn).format(
                  "MMMM D, YYYY h:mm A"
                )}
              </p>
              <ContainedLinkButton href="/">Back to Home</ContainedLinkButton>
            </div>
          )}
          {meetStore?.room?.status === "in-progress" && (
            <div className={styles.joinConfig}>
              <div>
                <div className={styles.previewContainer}>
                  <div className={styles.previewInnerContainer}>
                    {videoTrack ? (
                      <VideoTrack
                        previewStyle={true}
                        track={videoTrack}
                        isLocal
                      />
                    ) : (
                      <div className={styles.avatarContainer}>
                        <Avatar
                          src={appStore?.user?.basicInfo?.picture}
                          firstName={appStore?.user?.basicInfo?.firstName}
                          lastName={appStore?.user?.basicInfo?.lastName}
                          size="l"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.previewActions}>
                  <ToggleAudioButton disabled={disableButtons} />
                  <ToggleVideoButton disabled={disableButtons} />
                </div>
              </div>
              <div className={styles.actionSection}>
                <>
                  <h1 className={styles.roomName}>{meetStore?.roomName}</h1>
                  <p className={styles.joinText}>Ready to Join?</p>
                  <div className={styles.joinActions}>
                    <ContainedButton
                      onClick={handleJoin}
                      disabled={disableButtons}
                    >
                      Join Now
                    </ContainedButton>
                    <OutlineButton onClick={() => setDeviceSettingsOpen(true)}>
                      Settings
                    </OutlineButton>
                  </div>
                </>
              </div>
            </div>
          )}
        </main>
      </div>
      <DeviceSelectionDialog
        isOpen={deviceSettingsOpen}
        onRequestClose={() => {
          setDeviceSettingsOpen(false);
        }}
      />
    </>
  );
});

export default PreJoin;
