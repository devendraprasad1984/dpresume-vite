import React, { ReactNode } from "react";

import ActiveLink from "../core/ActiveLink";
import styles from "./MyConnectionsWithNav.module.scss";

const links = [
  {
    name: "People",
    href: "/ms/my/connections/people/",
  },
  // {
  //   name: "Orgs",
  //   href: "/ms/my/connections/orgs/",
  // },
  // {
  //   name: "Topics",
  //   href: "/ms/my/connections/topics/",
  // },
];

interface Props {
  children: ReactNode;
}

const MyConnectionsWithNav = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>My Connections</h1>
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
        <div>{children}</div>
      </div>
    </div>
  );
};

export default MyConnectionsWithNav;
