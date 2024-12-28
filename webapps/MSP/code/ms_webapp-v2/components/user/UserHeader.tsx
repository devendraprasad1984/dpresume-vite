import React from "react";
import { observer } from "mobx-react-lite";

import SubNav from "../nav/SubNav";
import PageHeader from "../core/PageHeader";
import useAdminStores from "../../stores/admin-context";
import styles from "./UserHeader.module.scss";
import useAdminUserLogic from "../../hooks/use-admin-user-logic";
import MoreActions from "../core/MoreActions";
import { SavingMessage } from "../core/SavingMessage";
import UIChip from "../core/UIChip";
import fullName from "../../utils/full-name";

interface Props {
  showActions?: boolean;
}

const UserHeader = observer(({ showActions }: Props) => {
  const { adminUserStore } = useAdminStores();
  const { userActions } = useAdminUserLogic();

  return (
    <>
      <PageHeader>
        <h1 className={"header"}>
          {adminUserStore?.user
            ? fullName([
                adminUserStore?.user?.basicInfo?.firstName,
                adminUserStore?.user?.basicInfo?.lastName,
              ])
            : " "}
        </h1>
        <UIChip type={adminUserStore?.user?.status}>
          <span className={styles.status}>{adminUserStore?.user?.status}</span>
        </UIChip>
      </PageHeader>
      <SubNav
        links={[
          {
            name: "Public",
            href: `/admin/users/${adminUserStore?.user?.userId}/public/`,
          },
          {
            name: "Private",
            href: `/admin/users/${adminUserStore?.user?.userId}/private/`,
          },
          {
            name: "People",
            href: `/admin/users/${adminUserStore?.user?.userId}/people/`,
          },
          {
            name: "Companies/Orgs",
            href: `/admin/users/${adminUserStore?.user?.userId}/orgs/`,
          },
          {
            name: "Topics",
            href: `/admin/users/${adminUserStore?.user?.userId}/topics/`,
          },
          // {
          //   name: "Sessions",
          //   href: `/admin/users/${adminUserStore?.user?.userId}/sessions/`,
          // },
        ]}
      >
        <div className={styles.navInfoGroup}>
          {showActions && (
            <>
              <SavingMessage isSaving={adminUserStore.isSaving} />
              {adminUserStore.user && (
                <MoreActions
                  id="edit-user-actions"
                  data={adminUserStore.user}
                  actions={userActions}
                />
              )}
            </>
          )}
        </div>
      </SubNav>
    </>
  );
});

export default UserHeader;
