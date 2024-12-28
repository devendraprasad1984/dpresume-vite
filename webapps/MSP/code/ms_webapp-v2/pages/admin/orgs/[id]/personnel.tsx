import React, { useEffect, useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import { IPersonnelSearchForUI } from "../../../../@types/Org";
import withLogin from "../../../../components/core/WithLogin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import useAdminStores from "../../../../stores/admin-context";
import Search from "../../../../components/core/Search";
import DataTable from "../../../../components/data-table/DataTable";
import DataTablePagination from "../../../../components/data-table/DataTablePagination";
import OrgHeader from "../../../../components/org/OrgHeader";
import styles from "../../../../components/core/PageLayout.module.scss";
import useToast from "../../../../hooks/use-toast";
import orgService from "../../../../services/org-service";
import fullName from "../../../../utils/full-name";
import ContainedButton from "../../../../components/buttons/ContainedButton";
import ChangeOrgUserRoleModal from "../../../../components/org/ChangeOrgUserRoleModal";
import AddPersonnelModal from "../../../../components/org/AddPersonnelModal";
import RemovePersonnelModal from "../../../../components/org/RemovePersonnelModal";

const Page = observer(() => {
  const { adminOrgStore, adminPeopleStore } = useAdminStores();
  const { showSuccessMessage, showServerError } = useToast();
  const [personnel, setPersonnel] = useState<IPersonnelSearchForUI[]>();
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IPersonnelSearchForUI>();
  const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);
  const [isRemovePersonnelModalOpen, setIsRemovePersonnelModalOpen] =
    useState(false);

  const router = useRouter();
  const { id } = router.query;
  const orgId = +id;

  const fetchPersonnel = useCallback(async () => {
    try {
      const res = await orgService.fetchPersonnel({
        filter: "getAllConnections",
        data: {
          companyId: orgId,
        },
      });

      setPersonnel(
        res?.data?.result?.data?.map((item) => ({
          ...item,
          user: {
            ...item?.user,
            name: fullName([item?.user?.firstName, item?.user?.lastName]),
          },
        }))
      );
    } catch (error) {
      showServerError(error);
    }
  }, [orgId, showServerError]);

  useEffect(() => {
    if (adminOrgStore?.org?.id !== orgId) adminOrgStore.fetchData(orgId);
    fetchPersonnel();
  }, [orgId, adminOrgStore, fetchPersonnel]);

  const onSearch = (text: string) => {
    adminPeopleStore.setSearchQuery(text);
    adminPeopleStore.fetchData();
  };

  const onRowClick = (personnel: IPersonnelSearchForUI) => {
    router
      .push(`/admin/users/${personnel?.user?.id}/public`)
      .then(() => window.scrollTo(0, 0));
  };

  const onChangeRole = (personnel: IPersonnelSearchForUI) => {
    setSelectedUser(personnel);
    setIsChangeRoleModalOpen(true);
  };

  const onChangeRoleConfirm = useCallback(
    async ({ role, user }: { role: string; user: IPersonnelSearchForUI }) => {
      try {
        await orgService.updatePersonnel(user?.id, {
          role,
        });

        showSuccessMessage({
          title: "Role Updated",
          message: "This user’s role has been successfully updated.",
        });

        setIsChangeRoleModalOpen(false);
        setSelectedUser(null);
        fetchPersonnel();
      } catch (error) {
        showServerError(error);
      }
    },
    [fetchPersonnel, showServerError, showSuccessMessage]
  );

  const onRemove = (personnel: IPersonnelSearchForUI) => {
    setSelectedUser(personnel);
    setIsRemovePersonnelModalOpen(true);
  };

  const onRemoveConfirm = async (personnel: IPersonnelSearchForUI) => {
    try {
      await orgService.deletePersonnel(personnel?.id);

      showSuccessMessage({
        title: "Connection Removed",
        message: "This connection has been successfully removed.",
      });

      setIsRemovePersonnelModalOpen(false);
      setSelectedUser(null);
      fetchPersonnel();
    } catch (error) {
      showServerError(error);
    }
  };

  const onAddPersonnel = () => {
    setIsAddPersonnelModalOpen(true);
  };

  const onAddPersonnelConfirm = async (userIDs: number[]) => {
    try {
      const body = userIDs?.map((id) => ({
        userId: id,
        companyId: orgId,
        status: "active",
        role: "Member",
      }));

      await orgService.addPersonnel(body);

      showSuccessMessage({
        title: "Personnel Added",
        message: "The selected personnel are successfully added.",
      });

      setIsAddPersonnelModalOpen(false);
      fetchPersonnel();
    } catch (error) {
      showServerError(error);
    }
  };

  return (
    <AdminLayout>
      <OrgHeader />

      <div className={styles.fullLayout}>
        <div className={styles.subHeader}>
          <Search
            onChange={onSearch}
            placeholder={"Search Personnel"}
            leftOffset={true}
          />
          <ContainedButton icon={"plus"} onClick={onAddPersonnel}>
            Add Personnel
          </ContainedButton>
        </div>

        <DataTable
          keyName="id"
          dataSet={personnel}
          columns={[
            {
              key: "user.name",
              name: "Name",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "user.email",
              name: "Email",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "role",
              name: "Role",
              sortable: true,
              columnSize: "10rem",
              type: "capitalize",
            },
            {
              key: "user.headline",
              name: "Title",
              sortable: true,
              columnSize: "1fr",
            },
            {
              key: "user.notesCount",
              name: "Notes",
              sortable: true,
              columnSize: "5rem",
            },
            {
              key: "user.status",
              name: "Status",
              sortable: true,
              columnSize: "8rem",
              type: "uiChip",
            },
          ]}
          onRowClick={onRowClick}
          actions={[
            {
              key: "role",
              name: "Change Role",
              icon: "key",
              onClick: onChangeRole,
            },
            {
              key: "remove",
              name: "Remove",
              icon: "trash",
              onClick: onRemove,
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
      </div>

      {isAddPersonnelModalOpen && (
        <AddPersonnelModal
          isOpen={isAddPersonnelModalOpen}
          onRequestClose={() => setIsAddPersonnelModalOpen(false)}
          existingPersonnel={personnel}
          onConfirm={onAddPersonnelConfirm}
        />
      )}

      {isChangeRoleModalOpen && (
        <ChangeOrgUserRoleModal
          isOpen={isChangeRoleModalOpen}
          onRequestClose={() => setIsChangeRoleModalOpen(false)}
          user={selectedUser}
          onConfirm={onChangeRoleConfirm}
        />
      )}

      {isRemovePersonnelModalOpen && (
        <RemovePersonnelModal
          isOpen={isRemovePersonnelModalOpen}
          personnel={selectedUser}
          onConfirm={onRemoveConfirm}
          onRequestClose={() => setIsRemovePersonnelModalOpen(true)}
        />
      )}
    </AdminLayout>
  );
});

export default withLogin(Page);
