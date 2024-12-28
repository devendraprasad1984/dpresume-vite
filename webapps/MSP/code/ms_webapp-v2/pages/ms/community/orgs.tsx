import React, { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";

import withLogin from "../../../components/core/WithLogin";
import UserLayout from "../../../components/user/UserLayout";
import CommunityContentWithNav from "../../../components/community/CommunityContentWithNav";
import useToast from "../../../hooks/use-toast";
import orgService from "../../../services/org-service";
import styles from "./orgs.module.scss";
import OrgCard from "../../../components/org/OrgCard";

const Page = observer(() => {
  const { showServerError } = useToast();
  const [orgs, setOrgs] = useState<ICompanySearch[]>([]);

  const getOrgs = useCallback(async () => {
    try {
      const res = await orgService.fetchOrgs({
        filter: "explore",
        data: {},
      });
      setOrgs(res?.data?.result?.data);
    } catch (error) {
      showServerError(error);
    }
  }, [showServerError]);

  useEffect(() => {
    getOrgs();
  }, [getOrgs]);

  return (
    <UserLayout>
      <CommunityContentWithNav>
        <div className={styles.orgs}>
          {orgs?.map((item) => (
            <OrgCard key={item?.companyId} org={item} />
          ))}
        </div>
      </CommunityContentWithNav>
    </UserLayout>
  );
});

export default withLogin(Page);
