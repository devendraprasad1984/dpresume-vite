import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";
import { PeopleConnectedStatus } from "ms-npm/search-models";

import styles from "./OrgCard.module.scss";
import OrgAvatar from "../core/OrgAvatar";
import OutlineButton from "../buttons/OutlineButton";
import useUserLogic from "../../hooks/use-user-logic";
import ContainedButton from "../buttons/ContainedButton";
import SaveButton from "../buttons/SaveButton";
import ActiveLink from "../core/ActiveLink";
import concatName from "../../utils/concat-name";

interface Props {
  org: ICompanySearch;
}

const OrgCard = observer(({ org }: Props) => {
  const { onConnectOrg } = useUserLogic();
  const [hasRequestSent, setHasRequestSent] = useState(false);

  const connect = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setHasRequestSent(true);

    try {
      await onConnectOrg();
    } catch (error) {
      setHasRequestSent(false);
    }
  };

  const message = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const save = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <ActiveLink
      href={`/ms/orgs/${org?.companyId}`}
      className={styles.container}
    >
      <div className={styles.avatarGroup}>
        <OrgAvatar
          name={org?.info?.name}
          size="xl"
          src={org?.info?.picture}
          alt={`Logo of ${org?.info?.name}`}
        />
        <SaveButton subtle={true} onClick={save} />
      </div>
      <div className={styles.metadata}>
        <p className={styles.orgName}>
          <span>{org?.info?.name}</span>
        </p>
        <p className={styles.location}>
          {concatName([org?.info?.city, org?.info?.state], ", ")}
        </p>
        <p className={styles.category}>{org?.info?.category}</p>
        <div className={styles.numConnections}>
          {org?.connectionNumber} Connections
        </div>
        <div className={styles.actions}>
          {org?.connectStatus === PeopleConnectedStatus.Connected && (
            <ContainedButton size="S" onClick={message}>
              Message
            </ContainedButton>
          )}
          {org?.connectStatus === PeopleConnectedStatus.NotConnected &&
            !hasRequestSent && (
              <OutlineButton
                size="S"
                onClick={connect}
                disabled={hasRequestSent}
              >
                Connect
              </OutlineButton>
            )}
          {(org?.connectStatus === PeopleConnectedStatus.Pending ||
            hasRequestSent) && (
            <OutlineButton size="S" disabled={true}>
              Pending
            </OutlineButton>
          )}
        </div>
      </div>
    </ActiveLink>
  );
});

export default OrgCard;
