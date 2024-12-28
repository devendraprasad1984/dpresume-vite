import React from "react";
import {observer} from "mobx-react-lite";
import {IProfile} from "ms-npm/profile-models";
import {ICompanySearch} from "ms-npm/search-models/_/company-search.model";

import styles from "./UserFlyoutProfile.module.scss";
import useAdminStores from "../../stores/admin-context";
import ContainedLinkButton from "../buttons/ContainedLinkButton";
import ProfileChip from "../core/ProfileChip";
import Avatar from "../core/Avatar";
import PeopleConnections from "./PeopleConnections";
import OrgConnections from "../org/OrgConnections";
import ActiveLink from "../core/ActiveLink";
import UserMSPshipObjectives from "./UserMSPshipObjectives";
import UserEducationExperience from "./UserEducationExperience";
import {SocialLinks} from "../core/SocialLinks";
import UserProfileName from "../core/UserProfileName";
import UserBio from "../core/UserBio";

interface Props {
    peopleConnections: IProfile[];
    orgConnections: ICompanySearch[];
}

const UserFlyoutProfile = observer(
    ({peopleConnections, orgConnections}: Props) => {
        const {adminUserStore} = useAdminStores();

        return (
            <div>
                <div className={styles.profileBanner}>
                    <div className={styles.profileBannerImage}/>
                    <div className={styles.profileBannerAvatar}>
                        <Avatar
                            size="xl"
                            src={adminUserStore?.user?.basicInfo?.picture}
                            alt="Avatar"
                            firstName={adminUserStore?.user?.basicInfo?.firstName}
                            lastName={adminUserStore?.user?.basicInfo?.lastName}
                        />
                    </div>
                </div>
                <div className={styles.profileContent}>
                    <UserProfileName
                        mode="header"
                        firstName={adminUserStore?.user?.basicInfo?.firstName}
                        lastName={adminUserStore?.user?.basicInfo?.lastName}
                        pronouns={adminUserStore?.user?.basicInfo?.pronouns}
                    />
                    {adminUserStore?.user?.basicInfo?.headline && (
                        <p className="bodyMedium">
                            {adminUserStore?.user?.basicInfo?.headline}
                        </p>
                    )}
                    {adminUserStore?.user?.basicInfo?.companyHeadline && (
                        <p className="smallLabel">
                            {adminUserStore?.user?.basicInfo?.companyHeadline}
                        </p>
                    )}
                    {adminUserStore?.user?.MSPshipObjectives?.lookingFor && (
                        <div className={styles.MSPshipGoals}>
                            <ProfileChip>
                                {adminUserStore?.user?.MSPshipObjectives?.lookingFor}
                            </ProfileChip>
                        </div>
                    )}
                    <SocialLinks
                        url={adminUserStore?.user?.publicContactInfo?.website}
                        linkedIn={adminUserStore?.user?.publicContactInfo?.linkedin}
                        facebook={adminUserStore?.user?.publicContactInfo?.facebook}
                        instagram={adminUserStore?.user?.publicContactInfo?.instagram}
                        twitter={adminUserStore?.user?.publicContactInfo?.twitter}
                    />
                    <div className={styles.viewUserLink}>
                        <ContainedLinkButton
                            disabled={!adminUserStore?.user?.userId}
                            href={
                                adminUserStore?.user?.userId &&
                                `/admin/users/${adminUserStore?.user?.userId}/public/`
                            }
                        >
                            View User Details
                        </ContainedLinkButton>
                    </div>
                    {(adminUserStore?.user?.bio?.intro ||
                        adminUserStore?.user?.bio?.text) && (
                        <div className={styles.section}>
                            <UserBio bio={adminUserStore?.user?.bio}/>
                        </div>
                    )}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>MSPship Objectives</h2>
                        <UserMSPshipObjectives
                            MSPshipObjectives={adminUserStore?.user?.MSPshipObjectives}
                        />
                    </div>
                    <hr className={styles.sectionSeparator}/>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Experience & Education</h2>
                        <UserEducationExperience
                            workHistory={adminUserStore?.user?.workHistory}
                            educationHistory={adminUserStore?.user?.educationHistory}
                        />
                    </div>
                    {peopleConnections?.length > 0 && (
                        <>
                            <hr className={styles.sectionSeparator}/>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>People</h2>
                                    <ActiveLink
                                        className={styles.seeAll}
                                        href={`/admin/users/${adminUserStore?.user?.userId}/people`}
                                    >
                                        See All
                                    </ActiveLink>
                                </div>
                                <PeopleConnections connections={peopleConnections}/>
                            </div>
                        </>
                    )}
                    {orgConnections?.length > 0 && (
                        <>
                            <hr className={styles.sectionSeparator}/>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Companies</h2>
                                    <ActiveLink
                                        className={styles.seeAll}
                                        href={`/admin/users/${adminUserStore?.user?.userId}/orgs`}
                                    >
                                        See All
                                    </ActiveLink>
                                </div>
                                <OrgConnections connections={orgConnections}/>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
);

export default UserFlyoutProfile;
