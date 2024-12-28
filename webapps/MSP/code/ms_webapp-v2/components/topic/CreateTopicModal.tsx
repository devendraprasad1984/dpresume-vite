import React, { ReactElement, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { ITopic, ITopicCreate, TopicAccess } from "ms-npm/topic-models";

import topicService from "../../services/topic-service";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import TextInput from "../form/TextInput";
import ProgressBar from "../core/ProgressBar";
import pxToRem from "../../utils/px-to-rem";
import ToggleWithLabel from "../core/ToggleWithLabel";
import DatePickerInput from "../core/DatePickerInput";
import styles from "./CreateTopicModal.module.scss";
import Radio from "../form/Radio";
import UserSelector from "../user/UserSelector";
import useToast from "../../hooks/use-toast";
import mediaService from "../../services/media-service";
import ProfileImageCropper from "../user/ProfileImageCropper";
import { IMediaCrop } from "../../@types/Media";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateTopicModal = ({ isOpen, onRequestClose }: Props): ReactElement => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [makeHidden, setMakeHidden] = useState(false);
  const [access, setAccess] = useState<TopicAccess>(TopicAccess.public);
  const [memberRefs, setMemberRefs] = useState<string[]>([]);
  const [topicImageFile, setTopicImageFile] = useState<File | undefined>();
  const [firstMessage, setFirstMessage] = useState("");

  const firstModalStep = 1;
  const lastModalStep = 4;
  const [currentModalStep, setCurrentModalStep] = useState(firstModalStep);
  const [isSaving, setIsSaving] = useState(false);

  const [cropData, setCropData] = useState<IMediaCrop>();
  const topicImageAspect = 16 / 9;

  const router = useRouter();
  const { showServerError } = useToast();

  const mapModalStepToName = () => {
    switch (currentModalStep) {
      case 1:
        return "Create New Topic";
      case 2:
        return "Add Topic Members";
      case 3:
        return "Add Topic Image";
      case 4:
        return "Write the First Message";
      default:
        return "";
    }
  };

  const isNextStepButtonDisabled = () => {
    switch (currentModalStep) {
      case 1:
        // if "Add End Date" toggled, then require date input to be filled
        if (hasEndDate && !endDate) {
          return true;
        }

        // both title and description required
        if (!title || !description) {
          return true;
        }

        return false;
      case 2:
        // at least one other member required
        if (memberRefs.length < 1) {
          return true;
        }

        return false;
      case 3:
        return false;
      case 4:
        // prevent click while API call processing
        if (isSaving) {
          return true;
        }

        return false;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentModalStep < lastModalStep) {
      setCurrentModalStep(currentModalStep + 1);
    } else {
      setIsSaving(true);

      const newTopic: ITopicCreate = {
        topic: {
          id: 0,
          ref: "",
          status: "active",
          moderators: [],
          access: access,
          title: title,
          description: description,
          endedOn: hasEndDate ? endDate : undefined,
          isHidden: makeHidden,
        },
        members: memberRefs,
        message: firstMessage,
      };

      try {
        const response = await topicService.addTopic(newTopic);

        // current flow requires us to know topic ref before we can upload the image
        if (topicImageFile && response?.data?.result) {
          await uploadTopicImage(response.data.result);
        } else {
          onSuccessfulTopicCreation();
        }
      } catch (e) {
        showServerError(e);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const uploadTopicImage = async (createdTopic: ITopic) => {
    setIsSaving(true);

    const formData = new FormData();

    formData.append("x", cropData?.x.toString());
    formData.append("y", cropData?.y.toString());
    formData.append("width", cropData?.width.toString());
    formData.append("height", cropData?.height.toString());
    formData.append("image", topicImageFile);

    try {
      // upload topic image via media service
      const response = await mediaService.uploadTopicImage(
        createdTopic.ref,
        formData
      );

      // once we have the url, update topic.picture property
      if (response?.data?.url) {
        await topicService.updateTopic(createdTopic.ref, {
          picture: response.data.url,
        });
      }
    } catch (e) {
      showServerError(e);
    } finally {
      setIsSaving(false);
      // even if topic image upload fails
      // we still want to redirect user to conversations page to see newly created topic
      onSuccessfulTopicCreation();
    }
  };

  const onSuccessfulTopicCreation = () => {
    router.push("/ms/conversations/").then(() => window.scrollTo(0, 0));
    onRequestClose();
  };

  const handleBack = () => {
    if (currentModalStep <= firstModalStep) {
      onRequestClose();
    } else {
      setCurrentModalStep(currentModalStep - 1);
    }
  };

  return (
    <BaseModal
      title={mapModalStepToName()}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
    >
      <ModalContent>
        <div className={styles.createTopicModal}>
          <ProgressBar
            progress={currentModalStep}
            total={lastModalStep}
            style={{
              marginBottom: pxToRem(28),
            }}
          />
          {currentModalStep === 1 && (
            <>
              <TextInput
                id="title"
                label="Enter Topic Name"
                value={title}
                onChange={setTitle}
                maxLength={75}
                showCharLimit
              />
              <TextInput
                id="description"
                label="Enter Description"
                value={description}
                onChange={setDescription}
                isTextArea
                maxLength={500}
                showCharLimit
              />
              <ToggleWithLabel
                id="addEndDate"
                isToggled={hasEndDate}
                onToggle={() => {
                  setHasEndDate(!hasEndDate);
                }}
                label="Add End Date"
                textWhenToggled="The topic will end at selected date."
                textWhenNotToggled="The topic will not have an end date."
              />
              {hasEndDate && (
                <DatePickerInput
                  label="End Date"
                  selected={endDate}
                  onChange={(date: Date) => {
                    setEndDate(date);
                  }}
                  style={{ marginBottom: pxToRem(20) }}
                  placeholderText="Select end date"
                />
              )}
              <Radio
                label="Public Topic"
                secondaryLabel="Available for anyone in the community to join."
                name="topicAccess"
                value={TopicAccess.public}
                isChecked={access === TopicAccess.public}
                onSelect={(val) => {
                  setAccess(val);
                }}
              />
              <Radio
                label="Private Topic"
                secondaryLabel="Requires requests from users to join."
                name="topicAccess"
                value={TopicAccess.private}
                isChecked={access === TopicAccess.private}
                onSelect={(val) => {
                  setAccess(val);
                }}
              />
              <hr />
              <ToggleWithLabel
                id="makeHidden"
                isToggled={makeHidden}
                onToggle={() => {
                  setMakeHidden(!makeHidden);
                }}
                label="Make Hidden"
                textWhenToggled="Users are not able to discover and search. Only users with an invitation or URL are able to join."
                textWhenNotToggled="Users are able to discover and search."
              />
              <hr />
            </>
          )}
          {/* use CSS to conditionally render UI for step 2 to avoid unmounting UserSelector component */}
          <div
            className={classNames(currentModalStep !== 2 && "visuallyHidden")}
          >
            <p className={styles.modalHelpText}>
              We recommend inviting 5 - 10 members from your connections if you
              want your Topic to grow.
            </p>
            <UserSelector
              idType="ref"
              onSelect={(users: string[]) => {
                setMemberRefs(users);
              }}
              filter="peopleSearch"
              showMeOnTop={true}
            />
          </div>
          {/* use CSS to conditionally render UI for step 3 to avoid unmounting ProfileImageCropper component */}
          <div
            className={classNames(currentModalStep !== 3 && "visuallyHidden")}
          >
            <p className={styles.modalHelpText}>
              Give people an idea what your Topic is about and make it
              recognizable for the members.
            </p>
            <ProfileImageCropper
              onChange={({ file, crop }) => {
                setTopicImageFile(file);
                setCropData(crop);
              }}
              recommendedResolution={[1600, 900]}
              aspect={topicImageAspect}
              dropZoneLabel="Upload Image"
            />
          </div>
          {currentModalStep === 4 && (
            <>
              <p className={styles.modalHelpText}>
                Welcome members to your Topic and set the tone for the
                conversation.
              </p>
              <TextInput
                label=""
                id="firstMessage"
                value={firstMessage}
                onChange={setFirstMessage}
                isTextArea
              />
            </>
          )}
        </div>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={handleBack}>
          {currentModalStep <= firstModalStep ? "Cancel" : "Back"}
        </OutlineButton>
        <ContainedButton
          onClick={handleNext}
          disabled={isNextStepButtonDisabled()}
        >
          {currentModalStep < lastModalStep ? "Next" : "Create Topic"}
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};
export default CreateTopicModal;
