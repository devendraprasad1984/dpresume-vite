import React from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../components/core/WithLogin";
import AdminLayout from "../../../components/admin/AdminLayout";

const Page = observer(() => {
  return (
    <AdminLayout>
      <h1 className={"header"}>Profile Summary</h1>
    </AdminLayout>
  );
});

export default withLogin(Page);
