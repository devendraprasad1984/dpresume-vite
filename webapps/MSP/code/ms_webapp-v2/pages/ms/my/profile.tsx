import React from "react";
import {observer} from "mobx-react-lite";
import {IProfile} from "ms-npm/profile-models";

import withLogin from "../../../components/core/WithLogin";
import UserLayout from "../../../components/user/UserLayout";
import ProfileSidebar from "../../../components/my/ProfileSidebar";
import MyPageHeader from "../../../components/my/MyPageHeader";
import UserBasicProfileForm from "../../../components/user/UserBasicProfileForm";
import useAppStores from "../../../stores/app-context";
import UserBioForm from "../../../components/user/UserBioForm";
import pageLayoutStyles from "../../../components/core/PageLayout.module.scss";
import UserWorkHistoryForm from "../../../components/user/UserWorkHistoryForm";
import UserEducationHistoryForm from "../../../components/user/UserEducationHistoryForm";
import UserPublicContactForm from "../../../components/user/UserPublicContactForm";
import ContainedLinkButton from "../../../components/buttons/ContainedLinkButton";
import UserMSPshipObjectivesForm from "../../../components/user/UserMSPshipObjectivesForm";

const Page = observer(() => {
    const {appStore} = useAppStores();

    const onUserUpdate = (user: IProfile) => {
        appStore?.setUser(user);
    };
    return (
        <UserLayout>
            <ProfileSidebar>
                <>
                    <MyPageHeader title={"My Profile"}>
                        <ContainedLinkButton href="/ms/my/profile/preview">
                            Preview Profile
                        </ContainedLinkButton>
                    </MyPageHeader>
                    <div className={pageLayoutStyles.containedLayout}>
                        <form className={pageLayoutStyles.form} noValidate={true}>
                            <UserBasicProfileForm
                                user={appStore?.user}
                                onUserUpdate={onUserUpdate}
                                onReFetchRequest={appStore?.fetchUserData}
                            />
                            <UserBioForm
                                user={appStore?.user}
                                onUserUpdate={onUserUpdate}
                                onReFetchRequest={appStore?.fetchUserData}
                            />
                            <UserWorkHistoryForm
                                user={appStore?.user}
                                onReFetchRequest={appStore?.fetchUserData}
                            />
                            <UserEducationHistoryForm
                                user={appStore?.user}
                                onReFetchRequest={appStore?.fetchUserData}
                            />
                            <UserPublicContactForm
                                user={appStore?.user}
                                onUserUpdate={onUserUpdate}
                                onReFetchRequest={appStore?.fetchUserData}
                            />
                            <UserMSPshipObjectivesForm
                                user={appStore?.user}
                                onUserUpdate={onUserUpdate}
                                onReFetchRequest={appStore?.fetchUserData}
                            />
                        </form>
                    </div>
                </>
            </ProfileSidebar>
        </UserLayout>
    );
});

export default withLogin(Page);
