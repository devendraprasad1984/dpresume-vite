import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import withLogin from "../../../../components/core/WithLogin";
import { Topic } from "../../../../@types/Topic";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import UserHeader from "../../../../components/user/UserHeader";
import Search from "../../../../components/core/Search";
import DataTable from "../../../../components/data-table/DataTable";
import DataTablePagination from "../../../../components/data-table/DataTablePagination";
import ArchiveTopicModal from "../../../../components/topic/ArchiveTopicModal";
import styles from "../../../../components/core/PageLayout.module.scss";
import useToast from "../../../../hooks/use-toast";

const Page = observer(() => {
  const { adminUserStore, adminTopicsStore } = useAdminStores();
  const { showSuccessMessage } = useToast();
  const router = useRouter();
  const { id } = router.query;
  const orgId = +id;

  useEffect(() => {
    if (adminUserStore?.user?.id !== orgId) adminUserStore.fetchData(orgId);
    adminTopicsStore.fetchData();
  }, [orgId, adminUserStore, adminTopicsStore]);

  const onSearch = (text: string) => {
    adminTopicsStore.setSearchQuery(text);
    adminTopicsStore.fetchData();
  };

  const onRowClick = (data: Topic) => {
    // TODO: Open flyout menu instead
    console.info(data);

    adminUserStore.reset();
    router
      .push(`/admin/topics/1/public`, `/admin/topics/1/public`)
      .then(() => window.scrollTo(0, 0));
  };

  const onEditTopic = (data: Topic) => {
    adminTopicsStore.setTopic(data);
  };

  const onManageMembers = (data: Topic) => {
    adminTopicsStore.setTopic(data);
  };

  const onArchive = (data: Topic) => {
    adminTopicsStore.setTopic(data);
    adminTopicsStore.setModalState({
      type: "archive",
      isOpen: true,
    });
  };

  const onArchiveUserConfirm = () => {
    // TODO: API Request here
    showSuccessMessage({
      title: "Topic Archived",
      message: "This topic has been successfully archived.",
    });

    adminTopicsStore.reset();
  };

  return (
    <AdminLayout>
      <UserHeader />

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Topics"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminTopicsStore.topics}
          columns={[
            { key: "name", name: "Name", sortable: true, columnSize: "1fr" },
            {
              key: "privacy",
              name: "Privacy",
              sortable: true,
              columnSize: "5rem",
              type: "capitalize",
            },
            {
              key: "createdOn",
              name: "Date Created",
              sortable: true,
              columnSize: "5rem",
              type: "date",
            },
            {
              key: "expiration",
              name: "Expiration",
              sortable: true,
              columnSize: "5rem",
              type: "date",
            },
            {
              key: "company",
              name: "Company",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "memberCount",
              name: "Members",
              sortable: true,
              columnSize: "5rem",
            },
            {
              key: "status",
              name: "Status",
              sortable: true,
              columnSize: "5.5rem",
              type: "uiChip",
            },
          ]}
          onRowClick={onRowClick}
          actions={[
            {
              key: "editTopic",
              name: "Edit Topic",
              icon: "edit",
              onClick: onEditTopic,
            },
            {
              key: "manageMembers",
              name: "Manage Members",
              icon: "people",
              onClick: onManageMembers,
            },
            {
              key: "archive",
              name: "Archive",
              icon: "trash",
              onClick: onArchive,
              isDestructive: true,
            },
          ]}
        />
        <DataTablePagination
          perPage={adminTopicsStore.perPage}
          lastPage={adminTopicsStore.lastPage}
          currentPage={adminTopicsStore.currentPage}
          onChangePerPage={adminTopicsStore.setPerPage}
          onChangeCurrentPage={adminTopicsStore.setCurrentPage}
          onSelectFirstPage={adminTopicsStore.goToFirstPage}
          onSelectNextPage={adminTopicsStore.goToNextPage}
          onSelectPreviousPage={adminTopicsStore.goToPreviousPage}
          onSelectLastPage={adminTopicsStore.goToLastPage}
        />
        {adminTopicsStore.isArchiveModalOpen && (
          <ArchiveTopicModal
            isOpen={adminTopicsStore.isArchiveModalOpen}
            onRequestClose={() => adminTopicsStore.reset()}
            topic={adminTopicsStore.topic}
            onConfirm={onArchiveUserConfirm}
          />
        )}
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
