import React from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../components/core/WithLogin";
import AdminLayout from "../../../components/admin/AdminLayout";
import CommunityHeader from "../../../components/admin/community/CommunityHeader";
import styles from "../../../components/core/PageLayout.module.scss";

const Page = observer(() => {
  return (
    <AdminLayout>
      <CommunityHeader />

      <div className={styles.fullLayout}>
        <h2 className={"smallHeader"}>Matching</h2>
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
