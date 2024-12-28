import React, { ReactElement, ReactNode, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import styles from "./UserLayout.module.scss";
import Logo from "../../public/static/Logo.svg";
import GlobalAdd from "../buttons/GlobalAdd";
import ActiveLink from "../core/ActiveLink";
import NavConversations from "../../public/static/icons/NavConversations.svg";
import NavConversationsFilled from "../../public/static/icons/NavConversationsFilled.svg";
import NavCommunity from "../../public/static/icons/NavCommunity.svg";
import NavCommunityFilled from "../../public/static/icons/NavCommunityFilled.svg";
import NavUser from "../../public/static/icons/NavUser.svg";
import NavUserFilled from "../../public/static/icons/NavUserFilled.svg";
import Corner from "../../public/static/icons/Corner.svg";
import GlobalSearch from "../core/GlobalSearch";
import MoreActions from "../core/MoreActions";
import CreateTopicModal from "../topic/CreateTopicModal";
import CreateConversationModal from "../conversation/CreateConversationModal";

interface Props {
  children?: ReactNode;
}

const UserLayout = observer(({ children }: Props): ReactElement => {
  const router = useRouter();
  const [isShowingNewTopicModal, setIsShowingNewTopicModal] = useState(false);
  const [isShowingNewConversationModal, setIsShowingNewConversationModal] =
    useState(false);

  const handleNewTopicClick = () => {
    setIsShowingNewTopicModal(true);
  };

  const handleNewConversationClick = () => {
    setIsShowingNewConversationModal(true);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <ActiveLink href="/">
            <Logo className={styles.logo} />
          </ActiveLink>
          <div className={styles.headerActions}>
            <GlobalSearch />
            <MoreActions
              id="globalAdd"
              actions={[
                {
                  key: "newTopic",
                  name: "Create New Topic",
                  icon: "viewTopic",
                  onClick: handleNewTopicClick,
                },
                {
                  key: "newConversation",
                  name: "New Conversation",
                  icon: "messageEdit",
                  onClick: handleNewConversationClick,
                },
              ]}
              Button={<GlobalAdd />}
            />
          </div>
        </div>
      </div>

      <div className={styles.sideBarAndContent}>
        <div className={styles.sideBar}>
          <ActiveLink
            href="/ms/conversations/"
            className={styles.sidebarNavButton}
            activeStyle={styles.activeSidebarNavButton}
            baseRoute="/ms/conversations/"
          >
            {router.asPath === "/ms/conversations/" ? (
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
            href="/ms/community/"
            className={styles.sidebarNavButton}
            activeStyle={styles.activeSidebarNavButton}
            baseRoute="/ms/community"
          >
            {router.asPath.includes("/ms/community") ? (
              <NavCommunityFilled
                className={styles.activeSidebarNavIcon}
                width={36}
                height={36}
              />
            ) : (
              <NavCommunity
                className={styles.sidebarNavIcon}
                width={36}
                height={36}
              />
            )}
          </ActiveLink>
          <ActiveLink
            href="/ms/my/profile/"
            className={styles.sidebarNavButton}
            activeStyle={styles.activeSidebarNavButton}
            baseRoute="/ms/my"
          >
            {router.asPath.includes("/ms/my") ? (
              <NavUserFilled
                className={styles.activeSidebarNavIcon}
                width={36}
                height={36}
              />
            ) : (
              <NavUser
                className={styles.sidebarNavIcon}
                width={36}
                height={36}
              />
            )}
          </ActiveLink>
        </div>

        <main className={styles.main}>{children}</main>
      </div>
      <Corner className={styles.contentCorner} />

      {isShowingNewTopicModal && (
        <CreateTopicModal
          isOpen={isShowingNewTopicModal}
          onRequestClose={() => {
            setIsShowingNewTopicModal(false);
          }}
        />
      )}

      {isShowingNewConversationModal && (
        <CreateConversationModal
          isOpen={isShowingNewConversationModal}
          onRequestClose={() => {
            setIsShowingNewConversationModal(false);
          }}
        />
      )}
    </>
  );
});

export default UserLayout;
