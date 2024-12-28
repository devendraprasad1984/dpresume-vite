import React from "react";

import MarketingLayout from "../components/marketing/MarketingLayout";
import ContainedLinkButton from "../components/buttons/ContainedLinkButton";
import PageHeader from "../components/core/PageHeader";

export default function Page() {
  return (
    <MarketingLayout>
      <PageHeader>
        <ContainedLinkButton href={"/ms/conversations/"}>
          User Landing Page
        </ContainedLinkButton>
        <ContainedLinkButton href={"/admin/community/users/"}>
          Admin Landing Page
        </ContainedLinkButton>
      </PageHeader>
    </MarketingLayout>
  );
}
