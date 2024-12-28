import React from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../components/core/WithLogin";
import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/core/PageHeader";

const Page = observer(() => {
  return (
    <AdminLayout>
      <PageHeader>
        <h1 className={"header"}>Analytics</h1>
      </PageHeader>
    </AdminLayout>
  );
});

export default withLogin(Page);
