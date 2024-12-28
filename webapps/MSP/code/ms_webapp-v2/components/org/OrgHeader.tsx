import React from "react";
import { observer } from "mobx-react-lite";

import SubNav from "../nav/SubNav";
import PageHeader from "../core/PageHeader";
import useAdminStores from "../../stores/admin-context";

const OrgHeader = observer(() => {
  const { adminOrgStore } = useAdminStores();

  return (
    <>
      <PageHeader>
        <h1 className={"header"}>{adminOrgStore?.org?.name}</h1>
      </PageHeader>
      <SubNav
        links={[
          {
            name: "Info",
            href: `/admin/orgs/${adminOrgStore?.org?.companyId}/info/`,
          },
          {
            name: "Personnel",
            href: `/admin/orgs/${adminOrgStore?.org?.companyId}/personnel/`,
          },
          // {
          //   name: "Sessions",
          //   href: `/admin/orgs/${adminOrgStore?.org?.companyId}/sessions/`,
          // },
          {
            name: "Topics",
            href: `/admin/orgs/${adminOrgStore?.org?.companyId}/topics/`,
          },
          // {
          //   name: "Jobs",
          //   href: `/admin/orgs/${adminOrgStore?.org?.companyId}/jobs/`,
          // },
        ]}
      />
    </>
  );
});

export default OrgHeader;
