import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import FormGroup from "../form/FromGroup";
import useAdminStores from "../../stores/admin-context";
import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import CheckBox from "../form/CheckBox";

interface Props {
  user: IProfile;
}

const UserNotificationSettingsForm = observer(({ user }: Props) => {
  const { adminUserStore } = useAdminStores();
  const { showServerError } = useToast();

  const [inAppMessaging, setInAppMessaging] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    setInAppMessaging(user?.notifications?.isAppMessagingAllowed);
    setPushNotifications(user?.notifications?.isPushNotificationAllowed);
  }, [user]);

  const updateNotifications = async ({
    key,
    value,
  }: {
    key: string;
    value: boolean;
  }) => {
    adminUserStore.setIsSaving(true);
    adminUserStore.setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [key]: value,
      },
    });

    try {
      await userService.updateUserProfile(user?.id, {
        notifications: {
          [key]: value,
        },
      });
    } catch (error) {
      adminUserStore.reFetchData();
      showServerError(error);
    } finally {
      adminUserStore.setIsSaving(false);
    }
  };

  const updateInAppMessaging = (value: boolean) => {
    setInAppMessaging(value);
    updateNotifications({ key: "isAppMessagingAllowed", value });
  };

  const updatePushNotifications = (value: boolean) => {
    setPushNotifications(value);
    updateNotifications({ key: "isPushNotificationAllowed", value });
  };

  return (
    <FormGroup>
      <h2 className="header">Permissions</h2>
      <CheckBox
        id="isAppMessagingAllowed"
        isChecked={inAppMessaging}
        onChange={updateInAppMessaging}
      >
        In-App Messaging
      </CheckBox>
      <CheckBox
        id="isPushNotificationAllowed"
        isChecked={pushNotifications}
        onChange={updatePushNotifications}
      >
        Push Notifications
      </CheckBox>
    </FormGroup>
  );
});

export default UserNotificationSettingsForm;
