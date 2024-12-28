import React, { ReactElement, ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import styles from "./AdminLayout.module.scss";
import Logo from "../../public/static/Logo.svg";
import OutlineButton from "../buttons/OutlineButton";
import GlobalAdd from "../buttons/GlobalAdd";
import ActiveLink from "../core/ActiveLink";
import NavConversations from "../../public/static/icons/NavConversations.svg";
import NavConversationsFilled from "../../public/static/icons/NavConversationsFilled.svg";
import NavCommunityManagement from "../../public/static/icons/NavCommunityManagement.svg";
import NavCommunityManagementFilled from "../../public/static/icons/NavCommunityManagementFilled.svg";
import SuspendUserModal from "../user/SuspendUserModal";
import UnArchiveUserModal from "../user/UnArchiveUserModal";
import ArchiveUserModal from "../user/ArchiveUserModal";
import AddNoteModal from "./AddNoteModal";
import ChangeRoleModal from "../user/ChangeRoleModal";
import ActivateUserModal from "../user/ActivateUserModal";
import useAdminUserLogic from "../../hooks/use-admin-user-logic";
import useAdminStores from "../../stores/admin-context";
import Corner from "../../public/static/icons/Corner.svg";
import { LoadingOverlay } from "../loaders/LoadingOverlay";
import useAuth from "../../hooks/use-auth";
import AddOrgModal from "./AddOrgModal";
import useAdminOrgLogic from "../../hooks/use-admin-org-logic";
import { IUserSearchForUI } from "../../@types/Admin";
import fullName from "../../utils/full-name";

interface Props {
  children?: ReactNode;
  showOverlay?: boolean;
}

const AdminLayout = observer(
  ({ children, showOverlay }: Props): ReactElement => {
    const router = useRouter();
    const { adminUsersStore, adminOrgsStore } = useAdminStores();
    const { signOut } = useAuth();

    const {
      onActivateUserConfirm,
      onAddNoteConfirm,
      onArchiveUserConfirm,
      onChangeRoleConfirm,
      onSuspendUserConfirm,
      onUnArchiveUserConfirm,
    } = useAdminUserLogic();

    const { onAddOrgConfirm } = useAdminOrgLogic();

    const onExitAdminView = () => {
      router.push("/ms/conversations/").then(() => window.scrollTo(0, 0));
    };

    const onAdd = () => {
      console.info("onAdd");
    };

    const onArchive = async (data: IUserSearchForUI) => {
      await onArchiveUserConfirm(data).then(() => adminUsersStore.fetchData());
    };

    const onUnArchive = async (data: IUserSearchForUI) => {
      await onUnArchiveUserConfirm(data).then(() =>
        adminUsersStore.fetchData()
      );
    };

    const onSuspend = async (data: IUserSearchForUI) => {
      await onSuspendUserConfirm(data).then(() => adminUsersStore.fetchData());
    };

    const onActivate = async (data: IUserSearchForUI) => {
      await onActivateUserConfirm(data).then(() => adminUsersStore.fetchData());
    };

    const onChangeRole = async (data: {
      role: string;
      user: IUserSearchForUI;
    }) => {
      await onChangeRoleConfirm(data).then(() => adminUsersStore.fetchData());
    };

    return (
      <>
        {showOverlay && <LoadingOverlay />}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <ActiveLink href="/">
              <Logo className={styles.logo} />
            </ActiveLink>
            <div className={styles.headerActions}>
              <OutlineButton onClick={onExitAdminView}>
                Exit Admin View
              </OutlineButton>
              <OutlineButton icon="signOut" onClick={signOut}>
                Sign Out
              </OutlineButton>
              <GlobalAdd onClick={onAdd} />
            </div>
          </div>
        </div>

        <div className={styles.sideBarAndContent}>
          <div className={styles.sideBar}>
            <ActiveLink
              href="/admin/conversations/"
              className={styles.sidebarNavButton}
              activeStyle={styles.activeSidebarNavButton}
              baseRoute="/admin/conversations/"
            >
              {router.asPath === "/admin/conversations/" ? (
                <NavConversationsFilled
                  className={styles.activeSidebarNavIcon}
                  width={36}
                  height={36}
                />
              ) : (
                <NavConversations
                  className={styles.sidebarNavIcon}
                  width={36}
                  height={36}
                />
              )}
            </ActiveLink>
            <ActiveLink
              href="/admin/community/users/"
              className={styles.sidebarNavButton}
              activeStyle={styles.activeSidebarNavButton}
              baseRoute="/admin/community"
            >
              {router.asPath.includes("/admin/community") ? (
                <NavCommunityManagementFilled
                  className={styles.activeSidebarNavIcon}
                  width={36}
                  height={36}
                />
              ) : (
                <NavCommunityManagement
                  className={styles.sidebarNavIcon}
                  width={36}
                  height={36}
                />
              )}
            </ActiveLink>
            {/*<ActiveLink*/}
            {/*  href="/admin/flagged/"*/}
            {/*  className={styles.sidebarNavButton}*/}
            {/*  activeStyle={styles.activeSidebarNavButton}*/}
            {/*  baseRoute="/admin/flagged"*/}
            {/*>*/}
            {/*  {router.asPath.includes("/admin/flagged") ? (*/}
            {/*    <NavFlagFilled*/}
            {/*      className={styles.activeSidebarNavIcon}*/}
            {/*      width={36}*/}
            {/*      height={36}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <NavFlag*/}
            {/*      className={styles.sidebarNavIcon}*/}
            {/*      width={36}*/}
            {/*      height={36}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*</ActiveLink>*/}
            {/*<ActiveLink*/}
            {/*  href="/admin/analytics/"*/}
            {/*  className={styles.sidebarNavButton}*/}
            {/*  activeStyle={styles.activeSidebarNavButton}*/}
            {/*  baseRoute="/admin/analytics"*/}
            {/*>*/}
            {/*  {router.asPath.includes("/admin/analytics") ? (*/}
            {/*    <NavAnalyticsFilled*/}
            {/*      className={styles.activeSidebarNavIcon}*/}
            {/*      width={36}*/}
            {/*      height={36}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <NavAnalytics*/}
            {/*      className={styles.sidebarNavIcon}*/}
            {/*      width={36}*/}
            {/*      height={36}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*</ActiveLink>*/}
            {/*<ActiveLink*/}
            {/*  href="/admin/settings/"*/}
            {/*  className={styles.sidebarNavButton}*/}
            {/*  activeStyle={styles.activeSidebarNavButton}*/}
            {/*  baseRoute="/admin/settings"*/}
            {/*>*/}
            {/*  {router.asPath.includes("/admin/settings") ? (*/}
            {/*    <NavSettingsFilled*/}
            {/*      className={styles.activeSidebarNavIcon}*/}
            {/*      width={36}*/}
            {/*      height={36}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <NavSettings*/}
            {/*      className={styles.sidebarNavIcon}*/}
            {/*      width={36}*/}
            {/*      height={36}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*</ActiveLink>*/}
          </div>

          <main className={styles.main}>{children}</main>
        </div>
        <Corner className={styles.contentCorner} />

        {adminUsersStore.isSuspendModalOpen && (
          <SuspendUserModal
            isOpen={adminUsersStore.isSuspendModalOpen}
            onRequestClose={() => adminUsersStore.reset()}
            user={adminUsersStore.user}
            onConfirm={onSuspend}
          />
        )}
        {adminUsersStore.isUnArchiveModalOpen && (
          <UnArchiveUserModal
            isOpen={adminUsersStore.isUnArchiveModalOpen}
            onRequestClose={() => adminUsersStore.reset()}
            user={adminUsersStore.user}
            onConfirm={onUnArchive}
          />
        )}
        {adminUsersStore.isArchiveModalOpen && (
          <ArchiveUserModal
            isOpen={adminUsersStore.isArchiveModalOpen}
            onRequestClose={() => adminUsersStore.reset()}
            user={adminUsersStore.user}
            onConfirm={onArchive}
          />
        )}
        {adminUsersStore.isAddNoteModalOpen && (
          <AddNoteModal
            isOpen={adminUsersStore.isAddNoteModalOpen}
            onRequestClose={() => adminUsersStore.reset()}
            name={fullName([
              adminUsersStore.user?.firstName,
              adminUsersStore.user?.lastName,
            ])}
            onConfirm={onAddNoteConfirm}
          />
        )}
        {adminUsersStore.isChangeRoleModalOpen && (
          <ChangeRoleModal
            isOpen={adminUsersStore.isChangeRoleModalOpen}
            onRequestClose={() => adminUsersStore.reset()}
            user={adminUsersStore.user}
            onConfirm={onChangeRole}
          />
        )}
        {adminUsersStore.isActivateModalOpen && (
          <ActivateUserModal
            isOpen={adminUsersStore.isActivateModalOpen}
            onRequestClose={() => adminUsersStore.reset()}
            user={adminUsersStore.user}
            onConfirm={onActivate}
          />
        )}
        {adminOrgsStore.isAddOrgModalOpen && (
          <AddOrgModal
            isOpen={adminOrgsStore.isAddOrgModalOpen}
            onRequestClose={() => adminOrgsStore.reset()}
            onConfirm={onAddOrgConfirm}
          />
        )}
      </>
    );
  }
);

export default AdminLayout;
