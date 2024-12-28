import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";

import styles from "./OrgConnections.module.scss";
import OrgAvatar from "../core/OrgAvatar";

interface Props {
  connections: ICompanySearch[];
}

const OrgConnections = ({ connections = [] }: Props) => {
  return (
    <div className={styles.connectionsContainer}>
      {connections?.length > 0 && (
        <ul className={styles.avatarStack}>
          {connections?.slice(0, 3)?.map((org) => (
            <li className={styles.avatarStackItem} key={org?.companyId}>
              <OrgAvatar size="l" src={org?.info?.picture} alt="logo" />
            </li>
          ))}
        </ul>
      )}

      <h4 className={styles.headerTitle}>{connections?.length} Connections</h4>
    </div>
  );
};

export default OrgConnections;
