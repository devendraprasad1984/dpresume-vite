import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../components/core/WithLogin";
import AdminLayout from "../../components/admin/AdminLayout";
import Search from "../../components/core/Search";
import PageHeader from "../../components/core/PageHeader";
import DataTable from "../../components/data-table/DataTable";
import DataTablePagination from "../../components/data-table/DataTablePagination";
import useAdminStores from "../../stores/admin-context";
import styles from "../../components/core/PageLayout.module.scss";
import { Conversation } from "../../@types/Conversation";
import UserFlyout from "../../components/user/UserFlyout";
import fullName from "../../utils/full-name";

const Page = observer(() => {
  const { adminConversationStore, adminUsersStore } = useAdminStores();

  useEffect(() => {
    return () => {
      adminUsersStore.setIsProfileDetailFlyoutOpen(false);
    };
  }, [adminUsersStore]);

  const onExpandUserProfile = (data: Conversation) => {
    adminUsersStore.setUser({
      ...data?.user,
      name: fullName([data?.user?.firstName, data?.user?.lastName]),
    });
    adminUsersStore.setProfileDetailTab("conversation");
    adminUsersStore.setIsProfileDetailFlyoutOpen(true);
  };

  useEffect(() => {
    adminConversationStore.resetSearch();
    adminConversationStore.fetchData();
  }, [adminConversationStore]);

  const onSearch = (text: string) => {
    adminConversationStore.setSearchQuery(text);
    adminConversationStore.fetchData();
  };

  return (
    <AdminLayout>
      <PageHeader>
        <h1 className={"header"}>Conversations</h1>
      </PageHeader>

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Users"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminConversationStore.conversations}
          columns={[
            { key: "name", name: "Name", sortable: true, columnSize: "1fr" },
            {
              key: "message",
              name: "Message",
              sortable: true,
              columnSize: "2fr",
            },
            {
              key: "date",
              name: "Date",
              sortable: true,
              columnSize: "10rem",
              type: "dateTime",
            },
            {
              key: "messageStatus",
              name: "Status",
              sortable: true,
              columnSize: "5rem",
              type: "uiChip",
            },
            {
              key: "notesCount",
              name: "Notes",
              sortable: true,
              columnSize: "5rem",
            },
          ]}
          onRowClick={onExpandUserProfile}
          onSort={adminConversationStore.sortResults}
        />
        <DataTablePagination
          perPage={adminConversationStore.perPage}
          lastPage={adminConversationStore.lastPage}
          currentPage={adminConversationStore.currentPage}
          onChangePerPage={adminConversationStore.setPerPage}
          onChangeCurrentPage={adminConversationStore.setCurrentPage}
          onSelectFirstPage={adminConversationStore.goToFirstPage}
          onSelectNextPage={adminConversationStore.goToNextPage}
          onSelectPreviousPage={adminConversationStore.goToPreviousPage}
          onSelectLastPage={adminConversationStore.goToLastPage}
        />
        <UserFlyout
          isOpen={adminUsersStore.isProfileDetailFlyoutOpen}
          onRequestClose={() =>
            adminUsersStore.setIsProfileDetailFlyoutOpen(false)
          }
        />
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
