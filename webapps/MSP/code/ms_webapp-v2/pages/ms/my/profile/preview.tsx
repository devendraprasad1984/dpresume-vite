import React from "react";
import {observer} from "mobx-react-lite";

import withLogin from "../../../../components/core/WithLogin";
import UserLayout from "../../../../components/user/UserLayout";
import useAppStores from "../../../../stores/app-context";
import UserMSPshipObjectives from "../../../../components/user/UserMSPshipObjectives";
import styles from "./preview.module.scss";
import Avatar from "../../../../components/core/Avatar";
import {SocialLinks} from "../../../../components/core/SocialLinks";
import ProfileChip from "../../../../components/core/ProfileChip";
import ContainedLinkButton from "../../../../components/buttons/ContainedLinkButton";
import UserEducationExperience from "../../../../components/user/UserEducationExperience";
import UserProfileName from "../../../../components/core/UserProfileName";
import UserBio from "../../../../components/core/UserBio";
import fullName from "../../../../utils/full-name";

const Page = observer(() => {
    const {appStore} = useAppStores();

    return (
        <UserLayout>
            <div className={styles.container}>
                <div className={styles.previewHeader}>
                    <UserProfileName
                        mode="header"
                        firstName={appStore?.user?.basicInfo?.firstName}
                        lastName={appStore?.user?.basicInfo?.lastName}
                        pronouns={appStore?.user?.basicInfo?.pronouns}
                    />
                    <ContainedLinkButton href="/ms/my/profile">
                        Exit Preview
                    </ContainedLinkButton>
                </div>
                <div className={styles.previewWrapper}>
                    <div className={styles.previewSection}>
                        <div className={styles.card}>
                            <div className={styles.profileBanner}>
                                <div className={styles.profileBannerImage}/>
                                <div className={styles.profileBannerAvatar}>
                                    <Avatar
                                        size="xxl"
                                        src={appStore?.user?.basicInfo?.picture}
                                        alt="Avatar"
                                        firstName={appStore?.user?.basicInfo?.firstName}
                                        lastName={appStore?.user?.basicInfo?.lastName}
                                        showOnlineStatus={true}
                                        isOnline={true}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <h1 className={styles.intro}>
                                    {fullName([
                                        "Hi, I’m",
                                        appStore?.user?.basicInfo?.firstName,
                                        appStore?.user?.basicInfo?.lastName,
                                    ])}
                                    {appStore?.user?.basicInfo?.pronouns && (
                                        <span className={styles.pronouns}>
                      ({appStore?.user?.basicInfo?.pronouns})
                    </span>
                                    )}
                                </h1>
                                <p className="bodyMedium">
                                    {appStore?.user?.workHistory[0]?.title}
                                </p>
                                <p className="smallLabel">
                                    {appStore?.user?.workHistory[0]?.company}
                                </p>
                                {appStore?.user?.MSPshipObjectives?.lookingFor && (
                                    <div className={styles.MSPshipGoals}>
                                        <ProfileChip>
                                            {appStore?.user?.MSPshipObjectives?.lookingFor}
                                        </ProfileChip>
                                    </div>
                                )}
                                <SocialLinks
                                    url={appStore?.user?.publicContactInfo.website}
                                    twitter={appStore?.user?.publicContactInfo.twitter}
                                    instagram={appStore?.user?.publicContactInfo.instagram}
                                    linkedIn={appStore?.user?.publicContactInfo.linkedin}
                                    facebook={appStore?.user?.publicContactInfo.facebook}
                                />
                                {(appStore?.user?.bio?.intro || appStore?.user?.bio?.text) && (
                                    <div className={styles.section}>
                                        <UserBio bio={appStore?.user?.bio}/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.sectionTitle}>MSPship Objectives</h2>
                                    <UserMSPshipObjectives
                                        MSPshipObjectives={appStore?.user?.MSPshipObjectives}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.sectionTitle}>
                                        Experience & Education
                                    </h2>
                                    <div className={styles.experience}>
                                        <UserEducationExperience
                                            educationHistory={appStore?.user?.educationHistory}
                                            workHistory={appStore?.user?.workHistory}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.topicsSection}>
                        {/* TODO put topics here when ready */}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
});

export default withLogin(Page);
