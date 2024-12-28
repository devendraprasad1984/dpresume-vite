import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import FormGroup from "../form/FromGroup";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import styles from "./UserBasicProfileForm.module.scss";
import { SavingMessage } from "../core/SavingMessage";
import TextInput from "../form/TextInput";

interface Props {
  user: IProfile;
  onChangeSaving?: (isSaving: boolean) => void;
  onUserUpdate?: (user: IProfile) => void;
  onReFetchRequest: () => void;
}

const UserBioForm = observer(
  ({ user, onChangeSaving, onUserUpdate, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();

    const [isSaving, setIsSaving] = useState(null);
    const [bioIntro, setBioIntro] = useState("");
    const [bioText, setBioText] = useState("");

    const initData = useRef(false);

    useEffect(() => {
      if (user && initData.current === false) {
        setBioIntro(user?.bio?.intro || "");
        setBioText(user?.bio?.text || "");
        initData.current = true;
      }
    }, [user]);

    const updateBasicProfile = async () => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      onUserUpdate({
        ...user,
        bio: {
          intro: bioIntro,
          text: bioText,
        },
      });

      try {
        await userService.updateUserProfile(user?.id, {
          bio: {
            intro: bioIntro,
            text: bioText,
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

    return (
      <FormGroup>
        <div className={styles.headerGroup}>
          <h2 className="header">Bio</h2>
          {!onChangeSaving && <SavingMessage isSaving={isSaving} />}
        </div>
        <TextInput
          id="bioIntro"
          label="Bio Intro"
          value={bioIntro}
          onChange={setBioIntro}
          onBlur={updateBasicProfile}
          maxLength={100}
          showCharLimit
        />
        <TextInput
          id="bioText"
          label="Bio Text"
          value={bioText}
          onChange={setBioText}
          onBlur={updateBasicProfile}
          isTextArea
          maxLength={500}
          showCharLimit
        />
      </FormGroup>
    );
  }
);

export default UserBioForm;
