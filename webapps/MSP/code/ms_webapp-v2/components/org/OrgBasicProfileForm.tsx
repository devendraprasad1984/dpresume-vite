import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { IInfo, CompanyCategory } from "ms-npm/company-models";
import { State } from "ms-npm/base-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import Select from "../form/Select";
import InputError, { InputErrorType } from "../form/InputError";
import orgService from "../../services/org-service";
import useToast from "../../hooks/use-toast";
import styles from "./OrgBasicProfileForm.module.scss";
import { SavingMessage } from "../core/SavingMessage";
import ContainedButton from "../buttons/ContainedButton";
import ProfileImageUploadModal from "../user/ProfileImageUploadModal";
import mediaService from "../../services/media-service";
import TextButton from "../buttons/TextButton";
import OrgAvatar from "../core/OrgAvatar";

interface Props {
  org: IInfo;
  onChangeSaving?: (isSaving: boolean) => void;
  onOrgUpdate?: (user: IInfo) => void;
  onReFetchRequest: () => void;
}

const OrgBasicProfileForm = observer(
  ({ org, onChangeSaving, onOrgUpdate, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();
    const [isSaving, setIsSaving] = useState(null);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [established, setEstablished] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [
      isProfilePictureUploadModalOpen,
      setIsProfilePictureUploadModalOpen,
    ] = useState(false);

    useEffect(() => {
      if (org) {
        setName(org?.name || "");
        setCategory(org?.category || "");
        setEstablished(String(org?.established) || "");
        setCity(org?.city || "");
        setState(org?.state || "");
      }
    }, [org]);

    const updateBasicProfile = async ({
      key,
      value,
    }: {
      key: string;
      value: string | number;
    }) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

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

    const updateCategory = (category) => {
      setCategory(category as CompanyCategory);
      updateBasicProfile({ key: "category", value: category || null });
    };

    const updateState = (state) => {
      setState(state);
      updateBasicProfile({ key: "state", value: state });
    };

    const onPhotoRemove = async () => {
      onOrgUpdate({
        ...org,
        photo: "",
      });

      try {
        await orgService.updateOrgInfo(org?.id, {
          photo: "",
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
        const res = await mediaService.uploadOrgProfilePhoto(
          org?.companyId,
          formData
        );

        onOrgUpdate({
          ...org,
          photo: res?.data?.url,
        });

        await orgService.updateOrgInfo(org?.id, {
          photo: res?.data?.url,
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
        <Label label="Company Name" htmlFor="org-name">
          <input
            id="org-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => updateBasicProfile({ key: "name", value: name })}
            autoComplete="off"
            aria-invalid={!name}
            placeholder="Enter company name here..."
          />
          <InputError messageType={InputErrorType.Required} isActive={!name} />
        </Label>
        <Label label="Category" htmlFor="org-category">
          <Select
            id={`org-category`}
            value={category}
            onChange={updateCategory}
          >
            <option value="">Select category</option>
            {Object.entries(CompanyCategory).map((item) => (
              <option key={item[0]} value={item[0]}>
                {item[1]}
              </option>
            ))}
          </Select>
        </Label>
        <Label label="Established Year" htmlFor="org-established">
          <input
            id="org-established"
            type="number"
            value={established}
            onChange={(e) => setEstablished(e.target.value)}
            onBlur={() =>
              updateBasicProfile({
                key: "established",
                value: Number(established),
              })
            }
          />
        </Label>
        <Label label="City" htmlFor="org-city">
          <input
            id="org-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => updateBasicProfile({ key: "city", value: city })}
            autoComplete="off"
            placeholder="Enter primary city here..."
          />
        </Label>
        <Label label="State" htmlFor="org-state">
          <Select id="org-state" value={state} onChange={updateState}>
            <option>Select state</option>
            {Object.entries(State).map((item) => (
              <option key={item[1]} value={item[1]}>
                {item[1]}
              </option>
            ))}
          </Select>
        </Label>

        <Label label="Profile Image" htmlFor="profileImage">
          {org?.photo && (
            <div className={styles.profileImage}>
              <OrgAvatar size="s" src={org?.photo} alt="Org Profile Image" />
              <TextButton
                onClick={() => setIsProfilePictureUploadModalOpen(true)}
              >
                Upload New Photo
              </TextButton>
              <TextButton onClick={onPhotoRemove}>Remove Photo</TextButton>
            </div>
          )}

          {!org?.photo && (
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

export default OrgBasicProfileForm;
