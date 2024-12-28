import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../components/core/WithLogin";
import AdminLayout from "../../../components/admin/AdminLayout";
import Search from "../../../components/core/Search";
import useAdminStores from "../../../stores/admin-context";
import CommunityHeader from "../../../components/admin/community/CommunityHeader";
import DataTable from "../../../components/data-table/DataTable";
import DataTablePagination from "../../../components/data-table/DataTablePagination";
import styles from "../../../components/core/PageLayout.module.scss";
import useAdminUserLogic from "../../../hooks/use-admin-user-logic";
import UserFlyout from "../../../components/user/UserFlyout";

const Page = observer(() => {
  const { adminUsersStore } = useAdminStores();
  const { onExpandUserProfile, userActions, onSearch } = useAdminUserLogic();

  useEffect(() => {
    return () => {
      adminUsersStore.setIsProfileDetailFlyoutOpen(false);
    };
  }, [adminUsersStore]);

  useEffect(() => {
    adminUsersStore.resetSearch();
    adminUsersStore.fetchData();
  }, [adminUsersStore]);

  return (
    <AdminLayout>
      <CommunityHeader />

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Users"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminUsersStore.users}
          columns={[
            {
              key: "name",
              name: "Name",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "email",
              name: "Email",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "role",
              name: "Role",
              sortable: true,
              columnSize: "5rem",
              type: "capitalize",
            },
            {
              key: "headline",
              name: "Headline",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "companyHeadline",
              name: "Company",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "notesCount",
              name: "Notes",
              sortable: true,
              columnSize: "5rem",
            },
            {
              key: "status",
              name: "Status",
              sortable: true,
              columnSize: "8rem",
              type: "uiChip",
            },
          ]}
          onRowClick={onExpandUserProfile}
          actions={userActions}
        />
        <DataTablePagination
          perPage={adminUsersStore.perPage}
          lastPage={adminUsersStore.lastPage}
          currentPage={adminUsersStore.currentPage}
          onChangePerPage={adminUsersStore.setPerPage}
          onChangeCurrentPage={adminUsersStore.setCurrentPage}
          onSelectFirstPage={adminUsersStore.goToFirstPage}
          onSelectNextPage={adminUsersStore.goToNextPage}
          onSelectPreviousPage={adminUsersStore.goToPreviousPage}
          onSelectLastPage={adminUsersStore.goToLastPage}
        />
      </div>
      <UserFlyout
        isOpen={adminUsersStore.isProfileDetailFlyoutOpen}
        onRequestClose={() =>
          adminUsersStore.setIsProfileDetailFlyoutOpen(false)
        }
      />
    </AdminLayout>
  );
});

export default withLogin(Page);
