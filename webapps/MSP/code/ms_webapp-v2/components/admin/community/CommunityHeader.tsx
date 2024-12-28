import React from "react";

import SubNav from "../../nav/SubNav";
import PageHeader from "../../core/PageHeader";

const CommunityHeader = () => {
  return (
    <>
      <PageHeader>
        <h1 className={"header"}>MS Community Management</h1>
      </PageHeader>
      <SubNav
        links={[
          {
            name: "Users",
            href: "/admin/community/users/",
          },
          // {
          //   name: "Matching",
          //   href: "/admin/community/matching/",
          // },
          {
            name: "Companies/Orgs",
            href: "/admin/community/orgs/",
          },
          // {
          //   name: "Sessions",
          //   href: "/admin/community/sessions/",
          // },
          {
            name: "Topics",
            href: "/admin/community/topics/",
          },
          // {
          //   name: "Jobs",
          //   href: "/admin/community/jobs/",
          // },
        ]}
      />
    </>
  );
};

export default CommunityHeader;
