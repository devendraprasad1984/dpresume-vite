import React, { ReactNode } from "react";
import ActiveLink from "../core/ActiveLink";

import styles from "./SubNav.module.scss";

interface Props {
  children?: ReactNode;
  links: {
    name: string;
    href: string;
  }[];
}

const SubNav = ({ links, children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
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
        {children}
      </div>
    </div>
  );
};

export default SubNav;
