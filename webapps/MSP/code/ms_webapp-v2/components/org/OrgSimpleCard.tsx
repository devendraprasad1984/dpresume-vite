import React from "react";
import { observer } from "mobx-react-lite";
import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";

import styles from "./OrgSimpleCard.module.scss";
import OrgAvatar from "../core/OrgAvatar";
import ActiveLink from "../core/ActiveLink";

interface Props {
  org: ICompanySearch;
}

const OrgSimpleCard = observer(({ org }: Props) => {
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
      </div>
      <div className={styles.metadata}>
        <p className={styles.orgName}>
          <span>{org?.info?.name}</span>
        </p>
        <p className={styles.category}>{org?.info?.category}</p>
      </div>
    </ActiveLink>
  );
});

export default OrgSimpleCard;
