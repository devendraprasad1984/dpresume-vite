import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { IInfo } from "ms-npm/company-models";

import withLogin from "../../../../components/core/WithLogin";
import styles from "../../../../components/core/PageLayout.module.scss";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import OrgHeader from "../../../../components/org/OrgHeader";
import OrgBasicProfileForm from "../../../../components/org/OrgBasicProfileForm";
import OrgPublicContactForm from "../../../../components/org/OrgPublicContactForm";
import pageLayoutStyles from "../../../../components/core/PageLayout.module.scss";

const Page = observer(() => {
  const { adminOrgStore } = useAdminStores();
  const router = useRouter();
  const { id } = router.query;
  const orgId = +id;

  useEffect(() => {
    if (adminOrgStore?.org?.companyId !== orgId) {
      adminOrgStore.setOrg(null);
      adminOrgStore.fetchData(orgId);
    }
  }, [orgId, adminOrgStore]);

  const onOrgUpdate = (org: IInfo) => {
    adminOrgStore?.setOrg(org);
  };

  return (
    <AdminLayout>
      <OrgHeader />

      <div className={styles.containedLayout}>
        <form className={pageLayoutStyles.form} noValidate={true}>
          <OrgBasicProfileForm
            org={adminOrgStore?.org}
            onOrgUpdate={onOrgUpdate}
            onReFetchRequest={adminOrgStore?.reFetchData}
          />
          <OrgPublicContactForm
            org={adminOrgStore?.org}
            onOrgUpdate={onOrgUpdate}
            onReFetchRequest={adminOrgStore?.reFetchData}
          />
        </form>
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
