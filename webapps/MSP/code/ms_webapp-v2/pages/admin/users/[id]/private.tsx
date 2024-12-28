import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import withLogin from "../../../../components/core/WithLogin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import UserHeader from "../../../../components/user/UserHeader";
import UserPrivateContactForm from "../../../../components/user/UserPrivateContactForm";
import UserPersonalDataForm from "../../../../components/user/UserPersonalDataForm";
import UserPermissionForm from "../../../../components/user/UserPermissionForm";
import styles from "../../../../components/core/PageLayout.module.scss";
import pageLayoutStyles from "../../../../components/core/PageLayout.module.scss";
import UserLoginDetails from "../../../../components/user/UserLoginDetails";
import UserNotificationSettingsForm from "../../../../components/user/UserNotificationSettingsForm";

const Page = observer(() => {
  const { adminUserStore } = useAdminStores();
  const router = useRouter();
  const { id } = router.query;
  const userId = +id;

  useEffect(() => {
    if (adminUserStore?.user?.userId !== userId)
      adminUserStore.fetchData(userId);
  }, [userId, adminUserStore]);

  return (
    <AdminLayout>
      <UserHeader showActions={true} />

      <div className={styles.containedLayout}>
        <form className={pageLayoutStyles.form} noValidate={true}>
          <UserPrivateContactForm user={adminUserStore?.user} />
          <UserPersonalDataForm user={adminUserStore?.user} />
          <UserPermissionForm user={adminUserStore?.user} />
          <UserLoginDetails user={adminUserStore?.user} />
          <UserNotificationSettingsForm user={adminUserStore?.user} />
        </form>
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
