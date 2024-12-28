import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import withLogin from "../../../../components/core/WithLogin";
import { Job } from "../../../../@types/Job";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import Search from "../../../../components/core/Search";
import DataTable from "../../../../components/data-table/DataTable";
import DataTablePagination from "../../../../components/data-table/DataTablePagination";
import ArchiveJobModal from "../../../../components/job/ArchiveJobModal";
import OrgHeader from "../../../../components/org/OrgHeader";
import styles from "../../../../components/core/PageLayout.module.scss";
import useToast from "../../../../hooks/use-toast";

const Page = observer(() => {
  const { adminOrgStore, adminJobsStore } = useAdminStores();
  const { showSuccessMessage } = useToast();

  const router = useRouter();
  const { id } = router.query;
  const orgId = +id;

  useEffect(() => {
    if (adminOrgStore?.org?.id !== orgId) adminOrgStore.fetchData(orgId);
    adminJobsStore.fetchData();
  }, [orgId, adminOrgStore, adminJobsStore]);

  const onSearch = (text: string) => {
    adminJobsStore.setSearchQuery(text);
    adminJobsStore.fetchData();
  };

  const onRowClick = (data: Job) => {
    // TODO: Open flyout menu instead
    console.info(data);

    adminOrgStore.reset();
    router
      .push(`/admin/jobs/1/public`, `/admin/jobs/1/public`)
      .then(() => window.scrollTo(0, 0));
  };

  const onEditJob = (data: Job) => {
    adminJobsStore.setJob(data);
  };

  const onManageMembers = (data: Job) => {
    adminJobsStore.setJob(data);
  };

  const onArchive = (data: Job) => {
    adminJobsStore.setJob(data);
    adminJobsStore.setModalState({
      type: "archive",
      isOpen: true,
    });
  };

  const onArchiveUserConfirm = () => {
    // TODO: API Request here
    showSuccessMessage({
      title: "Job Archived",
      message: "This job has been successfully archived.",
    });

    adminJobsStore.reset();
  };

  return (
    <AdminLayout>
      <OrgHeader />

      <div className={styles.fullLayout}>
        <Search
          onChange={onSearch}
          placeholder={"Search Jobs"}
          leftOffset={true}
        />

        <DataTable
          keyName="id"
          dataSet={adminJobsStore.jobs}
          columns={[
            {
              key: "title",
              name: "Job Title",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "employmentType",
              name: "Employment Type",
              sortable: true,
              columnSize: "7rem",
              type: "capitalize",
            },
            {
              key: "location",
              name: "Location",
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
              key: "publishedOn",
              name: "Date Published",
              sortable: true,
              columnSize: "6rem",
              type: "date",
            },
            {
              key: "viewCount",
              name: "Views",
              sortable: true,
              columnSize: "5rem",
            },
            {
              key: "appliedCount",
              name: "Applied",
              sortable: true,
              columnSize: "5rem",
            },
            {
              key: "status",
              name: "Status",
              sortable: true,
              columnSize: "7rem",
              type: "uiChip",
            },
          ]}
          onRowClick={onRowClick}
          actions={[
            {
              key: "editJob",
              name: "Edit Job",
              icon: "edit",
              onClick: onEditJob,
            },
            {
              key: "manageMembers",
              name: "Manage Members",
              icon: "people",
              onClick: onManageMembers,
            },
            {
              key: "archive",
              name: "Archive Job",
              icon: "trash",
              onClick: onArchive,
              isDestructive: true,
            },
          ]}
        />
        <DataTablePagination
          perPage={adminJobsStore.perPage}
          lastPage={adminJobsStore.lastPage}
          currentPage={adminJobsStore.currentPage}
          onChangePerPage={adminJobsStore.setPerPage}
          onChangeCurrentPage={adminJobsStore.setCurrentPage}
          onSelectFirstPage={adminJobsStore.goToFirstPage}
          onSelectNextPage={adminJobsStore.goToNextPage}
          onSelectPreviousPage={adminJobsStore.goToPreviousPage}
          onSelectLastPage={adminJobsStore.goToLastPage}
        />
        {adminJobsStore.isArchiveModalOpen && (
          <ArchiveJobModal
            isOpen={adminJobsStore.isArchiveModalOpen}
            onRequestClose={() => adminJobsStore.reset()}
            job={adminJobsStore.job}
            onConfirm={onArchiveUserConfirm}
          />
        )}
      </div>
    </AdminLayout>
  );
});

export default withLogin(Page);
