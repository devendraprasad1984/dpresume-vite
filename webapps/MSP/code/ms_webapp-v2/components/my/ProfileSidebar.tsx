import React, {ReactNode} from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

import styles from "./ProfileSidebar.module.scss";
import Avatar from "../core/Avatar";
import useAppStores from "../../stores/app-context";
import ActiveLink from "../core/ActiveLink";
import User from "../../public/static/icons/User.svg";
import MSLadder from "../../public/static/icons/MSLadder.svg";
import Calendar from "../../public/static/icons/Calendar.svg";
import Settings from "../../public/static/icons/Settings.svg";
import Match from "../../public/static/icons/Match.svg";
import Help from "../../public/static/icons/Help.svg";
import SignOut from "../../public/static/icons/SignOut.svg";
import useAuth from "../../hooks/use-auth";
import fullName from "../../utils/full-name";

interface Props {
    children: ReactNode;
}

const ProfileSidebar = observer(({children}: Props) => {
    const {appStore} = useAppStores();
    const {signOut} = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.pageTitleHeader}>
                    <Avatar
                        src={appStore?.user?.basicInfo?.picture}
                        size={"xxl"}
                        showOnlineStatus={true}
                        isOnline={true}
                        firstName={appStore?.user?.basicInfo?.firstName}
                        lastName={appStore?.user?.basicInfo?.lastName}
                        className={styles.avatar}
                    />
                    <div className={styles.namePronoun}>
                        <h1 className={styles.userName}>
                            {fullName([
                                appStore?.user?.basicInfo?.firstName,
                                appStore?.user?.basicInfo?.lastName,
                            ])}
                            {appStore?.user?.basicInfo?.pronouns && (
                                <span className={styles.pronouns}>
                  ({appStore?.user?.basicInfo?.pronouns})
                </span>
                            )}
                        </h1>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li>
                            <ActiveLink
                                href="/ms/my/profile/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <User className={styles.icon} width={18} height={18}/>
                                <span>My Profile</span>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink
                                href="/ms/my/connections/people/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <Match className={styles.icon} width={18} height={18}/>
                                <span>My Connections</span>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink
                                href="/ms/my/events/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <Calendar className={styles.icon} width={18} height={18}/>
                                <span>My Events</span>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink
                                href="/ms/my/settings/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <Settings className={styles.icon} width={18} height={18}/>
                                <span>Account Settings</span>
                            </ActiveLink>
                        </li>
                    </ul>
                </nav>
                <hr/>
                <nav className={styles.nav}>
                    <ul>
                        <li>
                            <ActiveLink
                                href="/ms/my/help/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <Help className={styles.icon} width={18} height={18}/>
                                <span>Help</span>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink
                                href="/ms/my/about/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <MSLadder className={styles.icon} width={18} height={18}/>
                                <span>About MSP</span>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink
                                href="/ms/my/privacy-policy/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <Calendar className={styles.icon} width={18} height={18}/>
                                <span>Privacy Policy</span>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink
                                href="/ms/my/legal/"
                                className={styles.link}
                                activeStyle={styles.activeLink}
                            >
                                <Settings className={styles.icon} width={18} height={18}/>
                                <span>Legal</span>
                            </ActiveLink>
                        </li>
                    </ul>
                </nav>
                <hr/>
                <nav className={styles.nav}>
                    <ul>
                        <li>
                            <button
                                type={"button"}
                                className={classNames(styles.link, styles.destructiveLink)}
                                onClick={signOut}
                            >
                                <SignOut className={styles.icon} width={18} height={18}/>
                                <span>Sign Out</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={styles.contentArea}>{children}</div>
        </div>
    );
});

export default ProfileSidebar;
