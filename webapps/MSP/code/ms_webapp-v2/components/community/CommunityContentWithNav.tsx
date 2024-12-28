import React, { ReactNode } from "react";

import ActiveLink from "../core/ActiveLink";
import styles from "./CommunityContentWithNav.module.scss";

const links = [
  {
    name: "All",
    href: "/ms/community/",
  },
  {
    name: "People",
    href: "/ms/community/people/",
  },
  {
    name: "Companies/Orgs",
    href: "/ms/community/orgs/",
  },
  // {
  //   name: "Topics",
  //   href: "/ms/community/topics/",
  // },
  // {
  //   name: "Sessions",
  //   href: "/ms/community/sessions/",
  // },
  // {
  //   name: "Jobs",
  //   href: "/ms/community/jobs/",
  // },
];

interface Props {
  children: ReactNode;
}

const CommunityContentWithNav = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Community</h1>
        <div className={styles.navContainer}>
          <div className={styles.navContainerInner}>
            <nav className={styles.nav}>
              <ul className={styles.linkNav}>
                {links?.map((link) => (
                  <li key={link.href}>
                    <ActiveLink
                      href={link.href}
                      className={styles.link}
                      activeStyle={styles.activeLink}
                    >
                      {link.name}
                    </ActiveLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
};

export default CommunityContentWithNav;
