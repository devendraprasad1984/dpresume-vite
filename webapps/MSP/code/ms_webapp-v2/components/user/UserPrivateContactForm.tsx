import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import useAdminStores from "../../stores/admin-context";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";

interface Props {
  user: IProfile;
}

const UserPrivateContactForm = observer(({ user }: Props) => {
  const { adminUserStore } = useAdminStores();
  const { showServerError } = useToast();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const initData = useRef(false);

  useEffect(() => {
    if (user && initData.current === false) {
      setEmail(user?.privateContactInfo?.email || "");
      setPhone(user?.privateContactInfo?.phone || "");
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
    adminUserStore.setIsSaving(true);

    try {
      await userService.updateUserProfile(user?.id, {
        privateContactInfo: {
          [key]: value,
        },
      });

      adminUserStore.setUser({
        ...user,
        privateContactInfo: {
          ...user.privateContactInfo,
          [key]: value,
        },
      });
    } catch (error) {
      showServerError(error);
    } finally {
      adminUserStore.setIsSaving(false);
    }
  };

  return (
    <FormGroup>
      <h2 className="header">Contact Info</h2>
      <Label label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() =>
            email !== user?.privateContactInfo?.email &&
            updatePublicContact({ key: "email", value: email })
          }
          autoComplete="off"
        />
      </Label>
      <Label label="Phone Number" htmlFor="phone">
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() =>
            phone !== user?.privateContactInfo?.phone &&
            updatePublicContact({ key: "phone", value: phone })
          }
          autoComplete="off"
        />
      </Label>
    </FormGroup>
  );
});

export default UserPrivateContactForm;
