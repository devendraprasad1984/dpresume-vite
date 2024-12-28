import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import withLogin from "../../../../components/core/WithLogin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import UserHeader from "../../../../components/user/UserHeader";
import Search from "../../../../components/core/Search";
import DataTable from "../../../../components/data-table/DataTable";
import DataTablePagination from "../../../../components/data-table/DataTablePagination";
import DeactivateOrgModal from "../../../../components/org/DeactivateOrgModal";
import styles from "../../../../components/core/PageLayout.module.scss";
import useAdminOrgLogic from "../../../../hooks/use-admin-org-logic";
import OrgFlyout from "../../../../components/org/OrgFlyout";

const Page = observer(() => {
  const { adminUserStore, adminOrgsStore } = useAdminStores();
  const { onExpandOrgProfile, onSearch, orgActions, onDeactivateConfirm } =
    useAdminOrgLogic();

  const router = useRouter();
  const { id } = router.query;
  const userId = +id;

  useEffect(() => {
    if (adminUserStore?.user?.id !== userId) adminUserStore.fetchData(userId);
    adminOrgsStore.fetchData();
  }, [userId, adminUserStore, adminOrgsStore]);

  return (
    <AdminLayout>
      <UserHeader />

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Companies / Orgs"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminOrgsStore.orgs}
          columns={[
            { key: "name", name: "Name", sortable: true, columnSize: "1fr" },
            {
              key: "admin.contact",
              name: "Admin Contact",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "admin.email",
              name: "Admin Email",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "category",
              name: "Category",
              sortable: true,
              columnSize: "1fr",
              type: "capitalize",
            },
            {
              key: "status",
              name: "Status",
              sortable: true,
              columnSize: "8rem",
              type: "uiChip",
            },
          ]}
          onRowClick={onExpandOrgProfile}
          actions={orgActions}
        />
        <DataTablePagination
          perPage={adminOrgsStore.perPage}
          lastPage={adminOrgsStore.lastPage}
          currentPage={adminOrgsStore.currentPage}
          onChangePerPage={adminOrgsStore.setPerPage}
          onChangeCurrentPage={adminOrgsStore.setCurrentPage}
          onSelectFirstPage={adminOrgsStore.goToFirstPage}
          onSelectNextPage={adminOrgsStore.goToNextPage}
          onSelectPreviousPage={adminOrgsStore.goToPreviousPage}
          onSelectLastPage={adminOrgsStore.goToLastPage}
        />
        {adminOrgsStore.isDeactivateModalOpen && (
          <DeactivateOrgModal
            isOpen={adminOrgsStore.isDeactivateModalOpen}
            onRequestClose={() => adminOrgsStore.reset()}
            org={adminOrgsStore.org}
            onConfirm={onDeactivateConfirm}
          />
        )}
      </div>
      <OrgFlyout
        isOpen={adminOrgsStore.isProfileDetailFlyoutOpen}
        onRequestClose={() =>
          adminOrgsStore.setIsProfileDetailFlyoutOpen(false)
        }
      />
    </AdminLayout>
  );
});

export default withLogin(Page);
