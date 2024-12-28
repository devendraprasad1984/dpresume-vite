import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import withLogin from "../../../components/core/WithLogin";
import { Session } from "../../../@types/Session";
import AdminLayout from "../../../components/admin/AdminLayout";
import useAdminStores from "../../../stores/admin-context";
import Search from "../../../components/core/Search";
import DataTable from "../../../components/data-table/DataTable";
import DataTablePagination from "../../../components/data-table/DataTablePagination";
import ArchiveSessionModal from "../../../components/session/ArchiveSessionModal";
import CommunityHeader from "../../../components/admin/community/CommunityHeader";
import styles from "../../../components/core/PageLayout.module.scss";
import useToast from "../../../hooks/use-toast";

const Page = observer(() => {
  const { adminUserStore, adminSessionsStore } = useAdminStores();
  const { showSuccessMessage } = useToast();
  const router = useRouter();

  useEffect(() => {
    adminSessionsStore.fetchData();
  }, [adminSessionsStore]);

  const onSearch = (text: string) => {
    adminSessionsStore.setSearchQuery(text);
    adminSessionsStore.fetchData();
  };

  const onRowClick = (data: Session) => {
    // TODO: Open flyout menu instead
    console.info(data);

    adminUserStore.reset();
    router
      .push(`/admin/sessions/1/public`, `/admin/sessions/1/public`)
      .then(() => window.scrollTo(0, 0));
  };

  const onEditSession = (data: Session) => {
    adminSessionsStore.setSession(data);
  };

  const onManageMembers = (data: Session) => {
    adminSessionsStore.setSession(data);
  };

  const onArchive = (data: Session) => {
    adminSessionsStore.setSession(data);
    adminSessionsStore.setModalState({
      type: "archive",
      isOpen: true,
    });
  };

  const onArchiveUserConfirm = () => {
    // TODO: API Request here
    showSuccessMessage({
      title: "Session Archived",
      message: "This session has been successfully archived.",
    });

    adminSessionsStore.reset();
  };

  return (
    <AdminLayout>
      <CommunityHeader />

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Sessions"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminSessionsStore.sessions}
          columns={[
            {
              key: "creator",
              name: "Creator",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "title",
              name: "Title",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "date",
              name: "Date",
              sortable: true,
              columnSize: "5rem",
              type: "date",
            },
            {
              key: "topic",
              name: "Topic",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "companyName",
              name: "Company",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "attendeeCount",
              name: "Attendees",
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
              key: "editSession",
              name: "Edit Session",
              icon: "edit",
              onClick: onEditSession,
            },
            {
              key: "manageMembers",
              name: "Manage Members",
              icon: "people",
              onClick: onManageMembers,
            },
            {
              key: "archive",
              name: "Archive Session",
              icon: "trash",
              onClick: onArchive,
              isDestructive: true,
            },
          ]}
        />
        <DataTablePagination
          perPage={adminSessionsStore.perPage}
          lastPage={adminSessionsStore.lastPage}
          currentPage={adminSessionsStore.currentPage}
          onChangePerPage={adminSessionsStore.setPerPage}
          onChangeCurrentPage={adminSessionsStore.setCurrentPage}
          onSelectFirstPage={adminSessionsStore.goToFirstPage}
          onSelectNextPage={adminSessionsStore.goToNextPage}
          onSelectPreviousPage={adminSessionsStore.goToPreviousPage}
          onSelectLastPage={adminSessionsStore.goToLastPage}
        />
        {adminSessionsStore.isArchiveModalOpen && (
          <ArchiveSessionModal
            isOpen={adminSessionsStore.isArchiveModalOpen}
            onRequestClose={() => adminSessionsStore.reset()}
            session={adminSessionsStore.session}
            onConfirm={onArchiveUserConfirm}
          />
        )}
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
