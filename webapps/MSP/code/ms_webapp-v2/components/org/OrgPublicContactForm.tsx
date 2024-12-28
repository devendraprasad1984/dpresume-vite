import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import TextareaAutosize from "react-textarea-autosize";
import { IInfo } from "ms-npm/company-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import orgService from "../../services/org-service";
import useToast from "../../hooks/use-toast";
import styles from "./OrgPublicContactForm.module.scss";
import { SavingMessage } from "../core/SavingMessage";
import TextInput from "../form/TextInput";
import { InputErrorType } from "../form/InputError";
import {
  isValidYouTube,
  isValidFacebook,
  isValidInstagram,
  isValidLinkedIn,
  isValidTwitter,
  isValidWebsite,
} from "../../helpers/validators";

interface Props {
  org: IInfo;
  onChangeSaving?: (isSaving: boolean) => void;
  onOrgUpdate?: (org: IInfo) => void;
  onReFetchRequest: () => void;
}

const OrgPublicContactForm = observer(
  ({ org, onChangeSaving, onOrgUpdate, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();
    const [isSaving, setIsSaving] = useState(null);

    const [bio, setBio] = useState("");
    const [video, setVideo] = useState("");
    const [website, setWebsite] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");

    useEffect(() => {
      if (org) {
        setBio(org?.bio || "");
        setVideo(org?.video || "");
        setWebsite(org?.website || "");
        setLinkedIn(org?.linkedIn || "");
        setFacebook(org?.facebook || "");
        setInstagram(org?.instagram || "");
        setTwitter(org?.twitter || "");
      }
    }, [org]);

    const updateVideo = (value: string) =>
      value !== org?.video && updateInfo({ key: "video", value });

    const updateWebsite = (value: string) =>
      value !== org?.website && updateInfo({ key: "website", value });

    const updateLinkedIn = (value: string) =>
      value !== org?.linkedIn && updateInfo({ key: "linkedIn", value });

    const updateFacebook = (value: string) =>
      value !== org?.facebook && updateInfo({ key: "facebook", value });

    const updateInstagram = (value: string) =>
      value !== org?.instagram && updateInfo({ key: "instagram", value });

    const updateTwitter = (value: string) =>
      value !== org?.twitter && updateInfo({ key: "twitter", value });

    const updateInfo = async ({
      key,
      value,
    }: {
      key: string;
      value: string | number;
    }) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      onOrgUpdate &&
        onOrgUpdate &&
        onOrgUpdate({
          ...org,
          [key]: value || null,
        });

      try {
        await orgService.updateOrgInfo(org?.id, {
          [key]: value || null,
        });
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
          <h2 className="header">About the Company</h2>
          {!onChangeSaving && <SavingMessage isSaving={isSaving} />}
        </div>
        <Label label="Bio" htmlFor="bio">
          <TextareaAutosize
            id="bio"
            minRows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={() => updateInfo({ key: "bio", value: bio })}
          />
        </Label>
        <TextInput
          id="video"
          label="YouTube Video"
          value={video}
          errorType={InputErrorType.URLInvalid}
          onChange={setVideo}
          onBlur={updateVideo}
          validator={isValidYouTube}
        />
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
          id="linkedIn"
          label="LinkedIn"
          value={linkedIn}
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

export default OrgPublicContactForm;
