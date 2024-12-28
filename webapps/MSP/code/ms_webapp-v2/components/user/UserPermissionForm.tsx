import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";
import { Role } from "ms-npm/auth-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import useAdminStores from "../../stores/admin-context";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import Select from "../form/Select";

interface Props {
  user: IProfile;
}

const UserPermissionForm = observer(({ user }: Props) => {
  const { adminUserStore } = useAdminStores();
  const { showServerError } = useToast();

  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(user?.user?.role);
  }, [user]);

  const updateUserData = async ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    adminUserStore.setIsSaving(true);
    adminUserStore.setUser({
      ...user,
      user: {
        ...user.user,
        [key]: value,
      },
    });

    try {
      await userService.updateUser(user?.id, {
        [key]: value,
      });
    } catch (error) {
      adminUserStore.reFetchData();
      showServerError(error);
    } finally {
      adminUserStore.setIsSaving(false);
    }
  };

  const updateRole = (value: string) => {
    setRole(value);
    updateUserData({ key: "role", value });
  };

  return (
    <FormGroup>
      <h2 className="header">Permissions</h2>
      <Label label="Role" htmlFor="role">
        <Select id="role" value={role} onChange={updateRole}>
          <option value={Role.Admin}>Company Administrator</option>
          <option value={Role.Recruiter}>Company Recruiter</option>
          <option value={Role.User}>User</option>
          <option value={Role.Member}>Member</option>
        </Select>
      </Label>
    </FormGroup>
  );
});

export default UserPermissionForm;
