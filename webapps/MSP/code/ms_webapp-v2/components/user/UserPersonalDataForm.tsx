import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import useAdminStores from "../../stores/admin-context";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import Select from "../form/Select";

interface Props {
  user: IProfile;
}

const UserPersonalDataForm = observer(({ user }: Props) => {
  const { adminUserStore } = useAdminStores();
  const { showServerError } = useToast();

  const [memberGroup, setMemberGroup] = useState("");
  const [ethnicity, setEthnicity] = useState("");

  useEffect(() => {
    setMemberGroup(user?.personalData?.memberGroup || "");
    setEthnicity(user?.personalData?.ethnicity || "");
  }, [user]);

  const updatePersonalData = async ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    adminUserStore.setIsSaving(true);

    try {
      await userService.updateUserProfile(user?.id, {
        personalData: {
          [key]: value,
        },
      });

      adminUserStore.setUser({
        ...user,
        personalData: {
          ...user.personalData,
          [key]: value,
        },
      });
    } catch (error) {
      showServerError(error);
      adminUserStore.reFetchData();
    } finally {
      adminUserStore.setIsSaving(false);
    }
  };

  const updateMemberGroup = () => {
    if (memberGroup !== user?.personalData?.memberGroup) {
      updatePersonalData({ key: "memberGroup", value: memberGroup });
    }
  };

  const updateEthnicity = (value: string) => {
    setEthnicity(value);
    updatePersonalData({ key: "ethnicity", value });
  };

  return (
    <FormGroup>
      <h2 className="header">Personal Data</h2>
      <Label label="Member Group" htmlFor="memberGroup">
        <input
          id="memberGroup"
          type="text"
          value={memberGroup}
          onChange={(e) => setMemberGroup(e.target.value)}
          onBlur={updateMemberGroup}
          autoComplete="off"
        />
      </Label>
      <Label label="Ethnicity" htmlFor="ethnicity">
        <Select id="ethnicity" value={ethnicity} onChange={updateEthnicity}>
          <option value="hispanic">
            Hispanic or Latino or Spanish Origin of any race
          </option>
          <option value="americanIndian">
            American Indian or Alaskan Native
          </option>
          <option value="Asian">Asian</option>
          <option value="hawaiian">
            Native Hawaiian or Other Pacific Islander
          </option>
          <option value="africanAmerican">Black or African American</option>
          <option value="white">White</option>
        </Select>
      </Label>
    </FormGroup>
  );
});

export default UserPersonalDataForm;
