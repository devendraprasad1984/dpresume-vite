import React from "react";
import { observer } from "mobx-react-lite";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/core/PageHeader";
import withLogin from "../../components/core/WithLogin";

const Page = observer(() => {
  return (
    <AdminLayout>
      <PageHeader>
        <h1 className={"header"}>Flagged</h1>
      </PageHeader>
    </AdminLayout>
  );
});

export default withLogin(Page);
