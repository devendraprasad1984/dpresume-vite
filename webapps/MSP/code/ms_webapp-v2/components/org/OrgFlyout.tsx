import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { IProfile } from "ms-npm/profile-models";

import styles from "./OrgFlyout.module.scss";
import ProfileFlyout from "../core/ProfileFlyout";
import useAdminStores from "../../stores/admin-context";
import XButton from "../buttons/XButton";
import MoreActions from "../core/MoreActions";
import useOrgsLogic from "../../hooks/use-admin-org-logic";
import OrgFlyoutProfile from "./OrgFlyoutProfile";
import OrgAvatar from "../core/OrgAvatar";
import userService from "../../services/user-service";
import useLog from "../../hooks/use-log";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

const OrgFlyout = observer(({ isOpen, onRequestClose }: Props) => {
  const { adminOrgStore, adminOrgsStore } = useAdminStores();
  const { orgActions } = useOrgsLogic();
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

  useEffect(() => {
    if (adminOrgsStore?.org?.id) {
      adminOrgStore.setOrg(null);
      adminOrgStore.fetchData(adminOrgsStore?.org?.id);
      fetchPeopleConnections(adminOrgsStore?.org?.id);
    }
  }, [adminOrgStore, adminOrgsStore?.org?.id, fetchPeopleConnections]);

  return (
    <ProfileFlyout isOpen={isOpen}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <OrgAvatar
            size={"s"}
            src={adminOrgStore?.org?.photo}
            alt="Logo"
            name={adminOrgStore?.org?.name}
          />
          <h1 className={styles.headerTitle}>{adminOrgStore?.org?.name}</h1>
        </div>
        <div className={styles.headerContent}>
          {adminOrgsStore?.org && (
            <MoreActions
              id="org-flyout-menu"
              data={adminOrgsStore?.org}
              actions={orgActions}
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
                adminOrgsStore.profileDetailTab === "profile" &&
                  styles.activeSubNavButton
              )}
              type="button"
              onClick={() => adminOrgsStore.setProfileDetailTab("profile")}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={classNames(
                styles.subNavButton,
                adminOrgsStore.profileDetailTab === "conversation" &&
                  styles.activeSubNavButton
              )}
              type="button"
              onClick={() => adminOrgsStore.setProfileDetailTab("conversation")}
            >
              Conversation
            </button>
          </li>
          <li>
            <button
              className={classNames(
                styles.subNavButton,
                adminOrgsStore.profileDetailTab === "notes" &&
                  styles.activeSubNavButton
              )}
              type="button"
              onClick={() => adminOrgsStore.setProfileDetailTab("notes")}
            >
              Notes
            </button>
          </li>
        </ul>
      </nav>
      {adminOrgsStore.profileDetailTab === "profile" && (
        <OrgFlyoutProfile peopleConnections={peopleConnections} />
      )}
      {adminOrgsStore.profileDetailTab === "conversation" && <></>}
      {adminOrgsStore.profileDetailTab === "notes" && <>Notes</>}
    </ProfileFlyout>
  );
});

export default OrgFlyout;
