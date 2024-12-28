import React from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../components/core/WithLogin";
import AdminLayout from "../../../components/admin/AdminLayout";
import styles from "../../../components/core/PageLayout.module.scss";

const Page = observer(() => {
  return (
    <AdminLayout>
      <div className={styles.fullLayout}>
        <h1 className={"header"}>User Management</h1>
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
