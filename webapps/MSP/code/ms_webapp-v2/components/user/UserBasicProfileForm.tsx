import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import styles from "./UserBasicProfileForm.module.scss";
import ContainedButton from "../buttons/ContainedButton";
import ProfileImageUploadModal from "./ProfileImageUploadModal";
import Avatar from "../core/Avatar";
import TextButton from "../buttons/TextButton";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import { SavingMessage } from "../core/SavingMessage";
import TextInput from "../form/TextInput";
import { InputErrorType } from "../form/InputError";
import mediaService from "../../services/media-service";

interface Props {
  user: IProfile;
  onChangeSaving?: (isSaving: boolean) => void;
  onUserUpdate?: (user: IProfile) => void;
  onReFetchRequest: () => void;
}

const UserBasicProfileForm = observer(
  ({ user, onChangeSaving, onUserUpdate, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();
    const initData = useRef(false);
    const [isSaving, setIsSaving] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [headline, setHeadline] = useState("");
    const [companyHeadline, setCompanyHeadline] = useState("");

    const [
      isProfilePictureUploadModalOpen,
      setIsProfilePictureUploadModalOpen,
    ] = useState(false);

    useEffect(() => {
      if (user && initData.current === false) {
        setFirstName(user?.basicInfo?.firstName || "");
        setLastName(user?.basicInfo?.lastName || "");
        setPronouns(user?.basicInfo?.pronouns || "");
        setHeadline(user?.basicInfo?.headline || "");
        setCompanyHeadline(user?.basicInfo?.companyHeadline || "");
        initData.current = true;
      }
    }, [user]);

    const updateBasicProfile = async ({
      key,
      value,
    }: {
      key: string;
      value: string;
    }) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      onUserUpdate &&
        onUserUpdate({
          ...user,
          basicInfo: {
            ...user.basicInfo,
            [key]: value,
          },
        });

      try {
        await userService.updateUserProfile(user?.id, {
          basicInfo: {
            [key]: value,
          },
        });
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const onPhotoRemove = async () => {
      onUserUpdate({
        ...user,
        basicInfo: {
          ...user.basicInfo,
          picture: "",
        },
      });

      try {
        await userService.updateUserProfile(user?.id, {
          basicInfo: {
            picture: "",
          },
        });
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const onPhotoConfirm = async ({ image, crop }) => {
      const formData = new FormData();
      formData.append("x", crop?.x);
      formData.append("y", crop?.y);
      formData.append("width", crop?.width);
      formData.append("height", crop?.height);
      formData.append("image", image);

      try {
        const res = await mediaService.uploadUserProfilePhoto(
          user?.user?.ref,
          formData
        );

        onUserUpdate({
          ...user,
          basicInfo: {
            ...user.basicInfo,
            picture: res?.data?.url,
          },
        });

        await userService.updateUserProfile(user?.user?.id, {
          basicInfo: {
            picture: res?.data?.url,
          },
        });

        setIsProfilePictureUploadModalOpen(false);
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    return (
      <FormGroup>
        <div className={styles.headerGroup}>
          <h2 className="header">Basic Information</h2>
          {!onChangeSaving && <SavingMessage isSaving={isSaving} />}
        </div>
        <TextInput
          id="firstName"
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          onBlur={() =>
            firstName !== user?.basicInfo?.firstName &&
            updateBasicProfile({ key: "firstName", value: firstName })
          }
          maxLength={50}
          showCharLimit
          errorType={InputErrorType.Required}
          validator={(val) => !!val}
        />
        <TextInput
          id="lastName"
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          onBlur={() =>
            lastName !== user?.basicInfo?.lastName &&
            updateBasicProfile({ key: "lastName", value: lastName })
          }
          maxLength={50}
          showCharLimit
          errorType={InputErrorType.Required}
          validator={(val) => !!val}
        />
        <TextInput
          id="pronouns"
          label="Pronouns"
          value={pronouns}
          onChange={setPronouns}
          onBlur={() =>
            pronouns !== user?.basicInfo?.pronouns &&
            updateBasicProfile({ key: "pronouns", value: pronouns })
          }
        />
        <TextInput
          id="headline"
          label="Headline"
          value={headline}
          onChange={setHeadline}
          onBlur={() =>
            headline !== user?.basicInfo?.headline &&
            updateBasicProfile({ key: "headline", value: headline })
          }
          errorType={InputErrorType.Required}
          validator={(val) => !!val}
        />
        <TextInput
          id="companyHeadline"
          label="Company / School / Org"
          value={companyHeadline}
          onChange={setCompanyHeadline}
          onBlur={() =>
            companyHeadline !== user?.basicInfo?.companyHeadline &&
            updateBasicProfile({
              key: "companyHeadline",
              value: companyHeadline,
            })
          }
          errorType={InputErrorType.Required}
          validator={(val) => !!val}
        />
        <Label label="Profile Image" htmlFor="profileImage">
          {user?.basicInfo?.picture && (
            <div className={styles.profileImage}>
              <Avatar
                size="s"
                src={user?.basicInfo?.picture}
                firstName={user?.basicInfo?.firstName}
                lastName={user?.basicInfo?.lastName}
                alt="User Profile Image"
              />
              <TextButton
                onClick={() => setIsProfilePictureUploadModalOpen(true)}
              >
                Upload New Photo
              </TextButton>
              <TextButton onClick={onPhotoRemove}>Remove Photo</TextButton>
            </div>
          )}

          {!user?.basicInfo?.picture && (
            <ContainedButton
              size="S"
              onClick={() => setIsProfilePictureUploadModalOpen(true)}
            >
              Upload an Image
            </ContainedButton>
          )}

          {isProfilePictureUploadModalOpen && (
            <ProfileImageUploadModal
              isOpen={isProfilePictureUploadModalOpen}
              onRequestClose={() => setIsProfilePictureUploadModalOpen(false)}
              onConfirm={onPhotoConfirm}
            />
          )}
        </Label>
      </FormGroup>
    );
  }
);

export default UserBasicProfileForm;
