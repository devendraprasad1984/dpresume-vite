import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import withLogin from "../../../../components/core/WithLogin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import UserHeader from "../../../../components/user/UserHeader";
import styles from "../../../../components/core/PageLayout.module.scss";
import pageLayoutStyles from "../../../../components/core/PageLayout.module.scss";
import UserBasicProfileForm from "../../../../components/user/UserBasicProfileForm";
import UserBioForm from "../../../../components/user/UserBioForm";
import UserWorkHistoryForm from "../../../../components/user/UserWorkHistoryForm";
import UserEducationHistoryForm from "../../../../components/user/UserEducationHistoryForm";
import UserPublicContactForm from "../../../../components/user/UserPublicContactForm";

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
          <UserBasicProfileForm
            user={adminUserStore?.user}
            onChangeSaving={(isSaving) => adminUserStore?.setIsSaving(isSaving)}
            onUserUpdate={(user) => adminUserStore?.setUser(user)}
            onReFetchRequest={adminUserStore?.reFetchData}
          />
          <UserBioForm
            user={adminUserStore?.user}
            onChangeSaving={(isSaving) => adminUserStore?.setIsSaving(isSaving)}
            onUserUpdate={(user) => adminUserStore?.setUser(user)}
            onReFetchRequest={adminUserStore?.reFetchData}
          />
          <UserWorkHistoryForm
            user={adminUserStore?.user}
            onReFetchRequest={adminUserStore?.reFetchData}
          />
          <UserEducationHistoryForm
            user={adminUserStore?.user}
            onReFetchRequest={adminUserStore?.reFetchData}
          />
          <UserPublicContactForm
            onChangeSaving={(isSaving) => adminUserStore?.setIsSaving(isSaving)}
            user={adminUserStore?.user}
            onReFetchRequest={adminUserStore?.reFetchData}
          />
        </form>
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
