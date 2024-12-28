import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { IProfile } from "ms-npm/profile-models";

import styles from "./UserFlyout.module.scss";
import ProfileFlyout from "../core/ProfileFlyout";
import useAdminStores from "../../stores/admin-context";
import XButton from "../buttons/XButton";
import MoreActions from "../core/MoreActions";
import useAdminUserLogic from "../../hooks/use-admin-user-logic";
import UserFlyoutProfile from "./UserFlyoutProfile";
import UserFlyoutConversation from "./UserFlyoutConversation";
import UserFlyoutNotes from "./UserFlyoutNotes";
import Avatar from "../core/Avatar";
import userService from "../../services/user-service";
import orgService from "../../services/org-service";
import useLog from "../../hooks/use-log";
import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";
import fullName from "../../utils/full-name";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

const UserFlyout = observer(({ isOpen, onRequestClose }: Props) => {
  const { adminUserStore, adminUsersStore } = useAdminStores();
  const { userActions } = useAdminUserLogic();
  const [orgConnections, setOrgConnections] = useState<ICompanySearch[]>([]);
  const [peopleConnections, setPeopleConnections] = useState<IProfile[]>([]);
  const { logServerError } = useLog();

  // TODO: Use real endpoint
  const fetchPeopleConnections = useCallback(
    async (id: number) => {
      try {
        const res = await userService.fetchPeopleConnections(id);
        setPeopleConnections(res.data.result);
      } catch (error) {
        logServerError(error);
      }
    },
    [logServerError]
  );

  // TODO: Use real endpoint
  const fetchOrgConnections = useCallback(async () => {
    try {
      const res = await orgService.fetchOrgs({
        filter: "explore",
        data: {},
      });
      setOrgConnections(res.data.result.data);
    } catch (error) {
      logServerError(error);
    }
  }, [logServerError]);

  useEffect(() => {
    if (adminUsersStore?.user?.id) {
      adminUserStore.setUser(null);
      adminUserStore.fetchData(adminUsersStore?.user?.id);
      fetchPeopleConnections(adminUsersStore?.user?.id);
      fetchOrgConnections();
    }
  }, [
    adminUserStore,
    adminUsersStore?.user?.id,
    adminUsersStore?.user?.ref,
    fetchPeopleConnections,
    fetchOrgConnections,
  ]);

  return (
    <ProfileFlyout isOpen={isOpen}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Avatar
            size={"s"}
            src={adminUserStore?.user?.basicInfo?.picture}
            alt="Avatar"
            firstName={adminUserStore?.user?.basicInfo?.firstName}
            lastName={adminUserStore?.user?.basicInfo?.lastName}
          />
          <h1 className={styles.headerTitle}>
            {fullName([
              adminUserStore?.user?.basicInfo?.firstName,
              adminUserStore?.user?.basicInfo?.lastName,
            ])}
          </h1>
        </div>
        <div className={styles.headerContent}>
          {adminUsersStore?.user && (
            <MoreActions
              id="user-flyout-menu"
              data={adminUsersStore?.user}
              actions={userActions}
              subtle={true}
            />
          )}
          <XButton subtle={true} onClick={onRequestClose} />
        </div>
      </div>
      <nav>
        <ul className={styles.headerSubNav}>
          <li>
            <button
              className={classNames(
                styles.subNavButton,
                adminUsersStore.profileDetailTab === "profile" &&
                  styles.activeSubNavButton
              )}
              type="button"
              onClick={() => adminUsersStore.setProfileDetailTab("profile")}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={classNames(
                styles.subNavButton,
                adminUsersStore.profileDetailTab === "conversation" &&
                  styles.activeSubNavButton
              )}
              type="button"
              onClick={() =>
                adminUsersStore.setProfileDetailTab("conversation")
              }
            >
              Conversation
            </button>
          </li>
          <li>
            <button
              className={classNames(
                styles.subNavButton,
                adminUsersStore.profileDetailTab === "notes" &&
                  styles.activeSubNavButton
              )}
              type="button"
              onClick={() => adminUsersStore.setProfileDetailTab("notes")}
            >
              Notes
            </button>
          </li>
        </ul>
      </nav>
      {adminUsersStore.profileDetailTab === "profile" && (
        <UserFlyoutProfile
          peopleConnections={peopleConnections}
          orgConnections={orgConnections}
        />
      )}
      {adminUsersStore.profileDetailTab === "conversation" && (
        <UserFlyoutConversation />
      )}
      {adminUsersStore.profileDetailTab === "notes" && <UserFlyoutNotes />}
    </ProfileFlyout>
  );
});

export default UserFlyout;
