import { IProfile } from "ms-npm/profile-models";

import styles from "./PeopleConnections.module.scss";
import Avatar from "../core/Avatar";

interface Props {
  connections: IProfile[];
}

const PeopleConnections = ({ connections = [] }: Props) => {
  const getStyle = (index: number) => {
    const val = -34 * index;
    return { transform: `translate(${val}px)`, zIndex: index };
  };

  return (
    <div className={styles.connectionsContainer}>
      {connections?.length > 0 && (
        <ul className={styles.avatarStack}>
          {connections?.slice(0, 6)?.map((user, index) => (
            <li
              className={styles.avatarStackItem}
              key={user.id}
              style={getStyle(index)}
            >
              <Avatar
                size="l"
                firstName={user?.basicInfo?.firstName}
                lastName={user?.basicInfo?.lastName}
                src={user?.basicInfo?.picture}
                alt="avatar"
                withBorder={true}
              />
            </li>
          ))}
        </ul>
      )}

      <h4 className={styles.headerTitle}>{connections?.length} Connections</h4>
    </div>
  );
};

export default PeopleConnections;
