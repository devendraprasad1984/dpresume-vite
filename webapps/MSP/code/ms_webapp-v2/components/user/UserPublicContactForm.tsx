import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import FormGroup from "../form/FromGroup";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import styles from "./UserBasicProfileForm.module.scss";
import { SavingMessage } from "../core/SavingMessage";
import TextInput from "../form/TextInput";
import { InputErrorType } from "../form/InputError";
import {
  isValidWebsite,
  isValidLinkedIn,
  isValidFacebook,
  isValidInstagram,
  isValidTwitter,
} from "../../helpers/validators";

interface Props {
  user: IProfile;
  onChangeSaving?: (isSaving: boolean) => void;
  onUserUpdate?: (user: IProfile) => void;
  onReFetchRequest: () => void;
}

const UserPublicContactForm = observer(
  ({ user, onChangeSaving, onUserUpdate, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();

    const [isSaving, setIsSaving] = useState(null);
    const [website, setWebsite] = useState("");
    const [linkedin, setLinkedIn] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");

    const initData = useRef(false);

    useEffect(() => {
      if (user && initData.current === false) {
        setWebsite(user?.publicContactInfo?.website || "");
        setLinkedIn(user?.publicContactInfo?.linkedin || "");
        setFacebook(user?.publicContactInfo?.facebook || "");
        setInstagram(user?.publicContactInfo?.instagram || "");
        setTwitter(user?.publicContactInfo?.twitter || "");
        initData.current = true;
      }
    }, [user]);

    const updatePublicContact = async ({
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
          publicContactInfo: {
            ...user.publicContactInfo,
            [key]: value,
          },
        });

      try {
        await userService.updateUserProfile(user?.id, {
          publicContactInfo: {
            [key]: value ? value : "",
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

    const updateWebsite = (value: string) =>
      value !== user?.publicContactInfo?.website &&
      updatePublicContact({ key: "website", value });

    const updateLinkedIn = (value: string) =>
      value !== user?.publicContactInfo?.linkedin &&
      updatePublicContact({ key: "linkedin", value });

    const updateFacebook = (value: string) =>
      value !== user?.publicContactInfo?.facebook &&
      updatePublicContact({ key: "facebook", value });

    const updateInstagram = (value: string) =>
      value !== user?.publicContactInfo?.instagram &&
      updatePublicContact({ key: "instagram", value });

    const updateTwitter = (value: string) =>
      value !== user?.publicContactInfo?.twitter &&
      updatePublicContact({ key: "twitter", value });

    return (
      <FormGroup>
        <div className={styles.headerGroup}>
          <h2 className="header">Contact Info</h2>
          {!onChangeSaving && <SavingMessage isSaving={isSaving} />}
        </div>
        <TextInput
          id="website"
          label="Website"
          value={website}
          errorType={InputErrorType.URLInvalid}
          onChange={setWebsite}
          onBlur={updateWebsite}
          validator={isValidWebsite}
        />
        <TextInput
          id="linkedin"
          label="LinkedIn"
          value={linkedin}
          errorType={InputErrorType.URLInvalid}
          onChange={setLinkedIn}
          onBlur={updateLinkedIn}
          validator={isValidLinkedIn}
        />
        <TextInput
          id="facebook"
          label="Facebook"
          value={facebook}
          errorType={InputErrorType.URLInvalid}
          onChange={setFacebook}
          onBlur={updateFacebook}
          validator={isValidFacebook}
        />
        <TextInput
          id="instagram"
          label="Instagram"
          value={instagram}
          errorType={InputErrorType.URLInvalid}
          onChange={setInstagram}
          onBlur={updateInstagram}
          validator={isValidInstagram}
        />
        <TextInput
          id="twitter"
          label="Twitter"
          value={twitter}
          errorType={InputErrorType.URLInvalid}
          onChange={setTwitter}
          onBlur={updateTwitter}
          validator={isValidTwitter}
        />
      </FormGroup>
    );
  }
);

export default UserPublicContactForm;
