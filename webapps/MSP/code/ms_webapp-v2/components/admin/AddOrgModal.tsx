import React, { ReactElement, useCallback, useState } from "react";
import { CompanyCategory } from "ms-npm/company-models";
import TextareaAutosize from "react-textarea-autosize";
import { State } from "ms-npm/base-models";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import InputError, { InputErrorType } from "../form/InputError";
import Label from "../form/Label";
import Select from "../form/Select";
import styles from "./AddOrgModal.module.scss";
import ProfileImageCropper from "../user/ProfileImageCropper";
import TextInput from "../form/TextInput";
import {
  isValidWebsite,
  isValidLinkedIn,
  isValidFacebook,
  isValidInstagram,
  isValidTwitter,
} from "../../helpers/validators";
import UserSelector from "../user/UserSelector";
import { IMediaCrop } from "../../@types/Media";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (org: {
    admin: {
      userId: number;
    };
    status: string;
    info: {
      name: string;
      category?: CompanyCategory;
    };
    established?: number;
    city?: string;
    state?: string;
    bio?: string;
    video?: string;
    website?: string;
    linkedIn?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    imageFile?: File;
    imageCrop?: IMediaCrop;
  }) => Promise<void>;
}

const AddOrgModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState<boolean>(null);
  const [category, setCategory] = useState<CompanyCategory | "">("");
  const [established, setEstablished] = useState<string>("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [adminId, setAdminId] = useState<number>(null);
  const [bio, setBio] = useState("");
  const [video, setVideo] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [imageFile, setImageFile] = useState<File>(null);
  const [imageCrop, setImageCrop] = useState<IMediaCrop>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCropChange = useCallback(
    ({ file, crop }: { file: File; crop: IMediaCrop }) => {
      setImageFile(file);
      setImageCrop(crop);
    },
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      onBasicInfoSubmit();
    } else if (step === 2) {
      onPersonnelSubmit();
    } else if (step === 3) {
      onAvatarSubmit();
    } else if (step === 4) {
      onAdditionalInfoSubmit();
    }
  };

  const onBasicInfoSubmit = () => {
    setIsNameValid(null);

    if (!name) {
      setIsNameValid(false);
      return;
    }

    // Skip Personnel
    setStep(2);
  };

  const onPersonnelSubmit = () => {
    if (!adminId) {
      return;
    }

    setStep(3);
  };

  const onAvatarSubmit = () => {
    setStep(4);
  };

  const onAdditionalInfoSubmit = () => {
    setIsSubmitting(true);

    const info: {
      name: string;
      category?: CompanyCategory;
    } = { name };
    if (category) {
      info.category = category as CompanyCategory;
    }

    onConfirm({
      status: "active",
      info,
      established: +established,
      city,
      state,
      admin: {
        userId: adminId,
      },
      bio,
      video,
      website,
      linkedIn,
      facebook,
      instagram,
      twitter,
      imageFile,
      imageCrop,
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const onAdminSelect = (admins: number[]) => {
    setAdminId(admins[0]);
  };

  return (
    <BaseModal
      title="Create Org"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <form onSubmit={onSubmit}>
        <ModalContent>
          <div className={styles.formGroup}>
            {step === 1 && (
              <>
                <Label label="Company Name" htmlFor={"org-name"}>
                  <input
                    id={"org-name"}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    aria-invalid={isNameValid === false}
                    placeholder="Enter company name here..."
                  />
                  <InputError
                    messageType={InputErrorType.Required}
                    isActive={isNameValid === false}
                  />
                </Label>
                <Label label="Category (Optional)" htmlFor={`org-category`}>
                  <Select
                    id={`org-category`}
                    value={category}
                    onChange={(category) =>
                      setCategory(category as CompanyCategory)
                    }
                  >
                    <option>Select category</option>
                    {Object.entries(CompanyCategory).map((item) => (
                      <option key={item[0]} value={item[0]}>
                        {item[1]}
                      </option>
                    ))}
                  </Select>
                </Label>
                <Label
                  label="Established Year (Optional)"
                  htmlFor={`org-established`}
                >
                  <input
                    id={`org-established`}
                    type="number"
                    value={established}
                    onChange={(e) => setEstablished(e.target.value)}
                    step={1}
                    placeholder="Enter established year here..."
                  />
                </Label>
                <Label label="City (Optional)" htmlFor={"org-city"}>
                  <input
                    id={"org-city"}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter primary city here..."
                  />
                </Label>
                <Label label="State (Optional)" htmlFor={`org-state`}>
                  <Select
                    id="org-state"
                    value={state}
                    onChange={(value) => setState(value)}
                  >
                    <option>Select state</option>
                    {Object.values(State).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </Label>
              </>
            )}
            {step === 2 && (
              <>
                <UserSelector
                  idType="id"
                  label="Select Company Admin(s)"
                  onSelect={onAdminSelect}
                  filter="peopleSearch"
                  showMeOnTop={true}
                />
              </>
            )}
            {step === 3 && (
              <>
                <ProfileImageCropper
                  onChange={onCropChange}
                  recommendedResolution={[800, 800]}
                />
              </>
            )}
            {step === 4 && (
              <>
                <Label label="Bio (Optional)" htmlFor="bio">
                  <TextareaAutosize
                    id="bio"
                    minRows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter company’s bio here..."
                  />
                </Label>
                <TextInput
                  id="video"
                  label="Video URL (Optional)"
                  value={video}
                  errorType={InputErrorType.URLInvalid}
                  onChange={(url) => setVideo(url)}
                  validator={isValidWebsite}
                  placeholder="Enter video URL here..."
                />
                <TextInput
                  id="websiteUrl"
                  label="Website URL (Optional)"
                  value={website}
                  errorType={InputErrorType.URLInvalid}
                  onChange={(url) => setWebsite(url)}
                  validator={isValidWebsite}
                  placeholder="Enter website URL here..."
                />
                <TextInput
                  id="linkedInUrl"
                  label="LinkedIn URL (Optional)"
                  value={linkedIn}
                  errorType={InputErrorType.URLInvalid}
                  onChange={(url) => setLinkedIn(url)}
                  validator={isValidLinkedIn}
                  placeholder="Enter LinkedIn URL here..."
                />
                <TextInput
                  id="facebookUrl"
                  label="Facebook URL (Optional)"
                  value={facebook}
                  errorType={InputErrorType.URLInvalid}
                  onChange={(url) => setFacebook(url)}
                  validator={isValidFacebook}
                  placeholder="Enter Facebook URL here..."
                />
                <TextInput
                  id="instagramUrl"
                  label="Instagram URL (Optional)"
                  value={instagram}
                  errorType={InputErrorType.URLInvalid}
                  onChange={(url) => setInstagram(url)}
                  validator={isValidInstagram}
                  placeholder="Enter Instagram URL here..."
                />
                <TextInput
                  id="twitterUrl"
                  label="Twitter URL (Optional)"
                  value={twitter}
                  errorType={InputErrorType.URLInvalid}
                  onChange={(url) => setTwitter(url)}
                  validator={isValidTwitter}
                  placeholder="Enter Twitter URL here..."
                />
              </>
            )}
          </div>
        </ModalContent>
        <ModalFooter>
          <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
          {step === 1 && (
            <ContainedButton disabled={!name} type="submit">
              Next
            </ContainedButton>
          )}
          {step === 2 && (
            <ContainedButton disabled={!adminId} type="submit">
              Next
            </ContainedButton>
          )}
          {step === 3 && <ContainedButton type="submit">Next</ContainedButton>}
          {step === 4 && (
            <ContainedButton disabled={isSubmitting} type="submit">
              Create Company
            </ContainedButton>
          )}
        </ModalFooter>
      </form>
    </BaseModal>
  );
};

export default AddOrgModal;
