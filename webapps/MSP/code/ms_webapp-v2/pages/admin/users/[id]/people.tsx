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
import DisconnectModal from "../../../../components/user/DisconnectModal";
import styles from "../../../../components/core/PageLayout.module.scss";
import useToast from "../../../../hooks/use-toast";
import { IUserSearchForUI } from "../../../../@types/Admin";

const Page = observer(() => {
  const { adminUserStore, adminPeopleStore } = useAdminStores();
  const { showSuccessMessage } = useToast();

  const router = useRouter();
  const { id } = router.query;
  const userId = +id;

  useEffect(() => {
    if (adminUserStore?.user?.id !== userId) adminUserStore.fetchData(userId);
    adminPeopleStore.fetchData();
  }, [userId, adminUserStore, adminPeopleStore]);

  const onSearch = (text: string) => {
    adminPeopleStore.setSearchQuery(text);
    adminPeopleStore.fetchData();
  };

  const onRowClick = (data: IUserSearchForUI) => {
    router
      .push(`/admin/users/${data?.id}/public`)
      .then(() => window.scrollTo(0, 0));
  };

  const onDisconnect = (data: IUserSearchForUI) => {
    adminPeopleStore.setUser(data);
    adminPeopleStore.setModalState({
      type: "disconnect",
      isOpen: true,
    });
  };

  const onDisconnectUserConfirm = () => {
    // TODO: API Request here
    showSuccessMessage({
      title: "Connection Removed",
      message: "This connection has been successfully removed.",
    });

    adminPeopleStore.reset();
  };

  return (
    <AdminLayout>
      <UserHeader />

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Users"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminPeopleStore.users}
          columns={[
            { key: "name", name: "Name", sortable: true, columnSize: "1fr" },
            { key: "email", name: "Email", sortable: true, columnSize: "1fr" },
            {
              key: "role",
              name: "Role",
              sortable: true,
              columnSize: "5rem",
              type: "capitalize",
            },
            { key: "title", name: "Title", sortable: true, columnSize: "1fr" },
            {
              key: "company",
              name: "Company",
              sortable: true,
              columnSize: "1fr",
            },
          ]}
          onRowClick={onRowClick}
          actions={[
            {
              key: "disconnect",
              name: "Disconnect",
              icon: "trash",
              onClick: onDisconnect,
              isDestructive: true,
            },
          ]}
        />
        <DataTablePagination
          perPage={adminPeopleStore.perPage}
          lastPage={adminPeopleStore.lastPage}
          currentPage={adminPeopleStore.currentPage}
          onChangePerPage={adminPeopleStore.setPerPage}
          onChangeCurrentPage={adminPeopleStore.setCurrentPage}
          onSelectFirstPage={adminPeopleStore.goToFirstPage}
          onSelectNextPage={adminPeopleStore.goToNextPage}
          onSelectPreviousPage={adminPeopleStore.goToPreviousPage}
          onSelectLastPage={adminPeopleStore.goToLastPage}
        />
        {adminPeopleStore.isDisconnectModalOpen && (
          <DisconnectModal
            isOpen={adminPeopleStore.isDisconnectModalOpen}
            onRequestClose={() => adminPeopleStore.reset()}
            user={adminPeopleStore.user}
            onConfirm={onDisconnectUserConfirm}
          />
        )}
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
