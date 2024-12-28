import React, { ReactElement, useState } from "react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import styles from "./ScheduleVideoModal.module.scss";
import Select from "../form/Select";
import { getDurations, getTimeSlots } from "../../utils/date-helpers";
import DatePickerInput from "../core/DatePickerInput";
import pxToRem from "../../utils/px-to-rem";
import TextInput from "../form/TextInput";
import { IScheduleVideoCallBody } from "../../@types/Conversation";
import useConversationHelper from "../stream/use-conversion-helper";
import dayjs, { ManipulateType } from "dayjs";
import useToast from "../../hooks/use-toast";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (any) => void;
}

const timeSlots = getTimeSlots();
const durations = getDurations();

const ScheduleVideoModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const { channelRef, channelMemberRefs } = useConversationHelper();
  const [selDuration, setSelDuration] = useState(durations[1]);
  const [currentTimeslot, setCurrentTimeslot] = useState(timeSlots[1]);
  const [selDate, setSelDate] = useState<Date | null>(new Date());
  const [videoCallName, setVideoCallName] = useState("");
  const { showErrorMessage } = useToast();

  const handleChangeDuration = (value: string) => {
    setSelDuration(value);
  };
  const handleSelectTimeslot = (value: string) => {
    setCurrentTimeslot(value);
  };

  const prepareBody = () => {
    if (videoCallName === "") {
      showErrorMessage({
        title: "Video call name",
        message: "Video Call name not given",
      });
      return;
    }

    if (selDuration === durations[0] || currentTimeslot === timeSlots[0]) {
      showErrorMessage({
        title: "Date/Time Select Error",
        message: "Kindly choose appropriate date / time",
      });
      return;
    }

    const durationSelArr = selDuration.split(" ");
    const curTimeSlotArr = currentTimeslot.split(" ");
    const durationTime: number = parseFloat(durationSelArr[0]);
    const timeUnit: ManipulateType = durationSelArr[1] as ManipulateType;
    const tempSelDate =
      dayjs(selDate).format("YYYY-MM-DD") + " " + curTimeSlotArr[0];
    const meetingStart: string = dayjs(tempSelDate).format();
    const meetingEnd: string = dayjs(tempSelDate)
      .add(durationTime, timeUnit)
      .format();
    const body: IScheduleVideoCallBody = {
      channelRef: channelRef,
      isRecurring: false,
      event: [
        {
          title: videoCallName,
          startedOn: meetingStart,
          endedOn: meetingEnd,
          invitees: channelMemberRefs,
        },
      ],
    };
    return body;
  };

  return (
    <BaseModal
      title="Schedule Video Call"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <div className={styles.lineGap}>
          <TextInput
            id="videoCallName"
            label="Video Call Name"
            value={videoCallName}
            onChange={setVideoCallName}
          />
        </div>

        <div className={styles.lineGap}>
          <DatePickerInput
            label="Date"
            selected={selDate}
            onChange={(date: Date) => {
              setSelDate(date);
            }}
            style={{ marginBottom: pxToRem(20) }}
            placeholderText="Select date"
          />
        </div>

        <div className={styles.lineGap}>
          <label className={styles.label}>Time</label>
          <Select
            id="timeslot-selector"
            value={currentTimeslot}
            onChange={(value) => handleSelectTimeslot(value)}
          >
            {timeSlots.map((timeslot: string) => {
              return (
                <option key={`timeslot-sel-${timeslot}`} value={timeslot}>
                  {timeslot}
                </option>
              );
            })}
          </Select>
        </div>

        <div className={styles.lineGap}>
          <label className={styles.label}>Duration</label>
          <Select
            id="duration-selector"
            value={selDuration}
            onChange={(value) => handleChangeDuration(value)}
          >
            {durations.map((duration: string) => {
              return (
                <option key={`duration-sel-${duration}`} value={duration}>
                  {duration}
                </option>
              );
            })}
          </Select>
        </div>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={() => onConfirm(prepareBody())}>
          Schedule Video Call
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ScheduleVideoModal;
