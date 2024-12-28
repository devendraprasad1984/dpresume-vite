import React, {useCallback, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useRouter} from "next/router";
import {IProfile} from "ms-npm/profile-models";

import withLogin from "../../../components/core/WithLogin";
import UserLayout from "../../../components/user/UserLayout";
import userService from "../../../services/user-service";
import styles from "./id.module.scss";
import UserProfileName from "../../../components/core/UserProfileName";
import Avatar from "../../../components/core/Avatar";
import ProfileChip from "../../../components/core/ProfileChip";
import {SocialLinks} from "../../../components/core/SocialLinks";
import UserBio from "../../../components/core/UserBio";
import UserMSPshipObjectives from "../../../components/user/UserMSPshipObjectives";
import UserEducationExperience from "../../../components/user/UserEducationExperience";
import ContainedButton from "../../../components/buttons/ContainedButton";
import fullName from "../../../utils/full-name";
import useUserLogic from "../../../hooks/use-user-logic";

const Page = observer(() => {
    const router = useRouter();
    const {id} = router.query;
    const userId = +id;

    const {onConnect} = useUserLogic();
    const [isConnected, setIsConnected] = useState(false);

    const [userProfile, setUserProfile] = useState<IProfile>();

    const connect = async () => {
        setIsConnected(true);

        try {
            await onConnect({
                ref: userProfile?.user?.ref,
                name: fullName([
                    userProfile?.basicInfo?.firstName,
                    userProfile?.basicInfo?.lastName,
                ]),
            });
        } catch (error) {
            setIsConnected(false);
        }
    };

    const fetchUserProfile = useCallback(async () => {
        try {
            const res = await userService.fetchUserProfile(userId);
            setUserProfile(res?.data?.result);
        } catch (error) {
            console.error(error);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserProfile();
    }, [userId, fetchUserProfile]);

    return (
        <UserLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <UserProfileName
                        mode="header"
                        firstName={userProfile?.basicInfo?.firstName}
                        lastName={userProfile?.basicInfo?.lastName}
                        pronouns={userProfile?.basicInfo?.pronouns}
                    />
                    <ContainedButton onClick={connect} disabled={isConnected}>
                        Connect
                    </ContainedButton>
                </div>
                <div className={styles.wrapper}>
                    <div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.profileBanner}>
                                    <div className={styles.profileBannerImage}/>
                                    <div className={styles.profileBannerAvatar}>
                                        <Avatar
                                            size="xxl"
                                            src={userProfile?.basicInfo?.picture}
                                            alt="Avatar"
                                            firstName={userProfile?.basicInfo?.firstName}
                                            lastName={userProfile?.basicInfo?.lastName}
                                        />
                                    </div>
                                </div>
                                <div className={styles.cardContent}>
                                    <h1 className={styles.intro}>
                                        {fullName([
                                            "Hi, I’m",
                                            userProfile?.basicInfo.firstName,
                                            userProfile?.basicInfo.lastName,
                                        ])}
                                        {userProfile?.basicInfo.pronouns && (
                                            <span className={styles.pronouns}>
                        ({userProfile?.basicInfo.pronouns})
                      </span>
                                        )}
                                    </h1>
                                    <p className="bodyMedium">
                                        {userProfile?.workHistory[0]?.title}
                                    </p>
                                    <p className="smallLabel">
                                        {userProfile?.workHistory[0]?.company}
                                    </p>
                                    {userProfile?.MSPshipObjectives?.lookingFor && (
                                        <div className={styles.MSPshipGoals}>
                                            <ProfileChip>
                                                {userProfile?.MSPshipObjectives?.lookingFor}
                                            </ProfileChip>
                                        </div>
                                    )}
                                    <div className={styles.socialLinksSection}>
                                        <SocialLinks
                                            url={userProfile?.publicContactInfo.website}
                                            twitter={userProfile?.publicContactInfo.twitter}
                                            instagram={userProfile?.publicContactInfo.instagram}
                                            linkedIn={userProfile?.publicContactInfo.linkedin}
                                            facebook={userProfile?.publicContactInfo.facebook}
                                        />
                                    </div>
                                    {(userProfile?.bio?.intro || userProfile?.bio?.text) && (
                                        <div className={styles.bioContainer}>
                                            <UserBio bio={userProfile?.bio}/>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.sectionTitle}>MSPship Objectives</h2>
                                    <UserMSPshipObjectives
                                        MSPshipObjectives={userProfile?.MSPshipObjectives}
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
                                    <div>
                                        <UserEducationExperience
                                            educationHistory={userProfile?.educationHistory}
                                            workHistory={userProfile?.workHistory}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.sectionTitle}>Topics</h2>
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.sectionTitle}>People</h2>
                                </div>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.sectionTitle}>Companies</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
});

export default withLogin(Page);
