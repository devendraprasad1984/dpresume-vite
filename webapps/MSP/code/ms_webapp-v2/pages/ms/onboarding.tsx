import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";
import {LookingFor} from "ms-npm/profile-models";
import {isEmpty, omitBy} from "lodash";

import withLogin from "../../components/core/WithLogin";
import styles from "./onboarding.module.scss";
import ActiveLink from "../../components/core/ActiveLink";
import Logo from "../../public/static/Logo.svg";
import ContainedButton from "../../components/buttons/ContainedButton";
import userService from "../../services/user-service";
import useAppStores from "../../stores/app-context";
import useToast from "../../hooks/use-toast";
import StarClusterPurple from "../../public/static/icons/StarClusterPurple.svg";
import StarClusterTeal from "../../public/static/icons/StarClusterTeal.svg";
import StarClusterOrange from "../../public/static/icons/StarClusterOrange.svg";
import StarClusterRed from "../../public/static/icons/StarClusterRed.svg";
import StarClusterGreen from "../../public/static/icons/StarClusterGreen.svg";
import Tada from "../../public/static/TaDa.svg";
import ContainedLinkButton from "../../components/buttons/ContainedLinkButton";
import authService from "../../services/auth-service";

const Page = observer(() => {
    const {appStore} = useAppStores();
    const {showServerError} = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [step, setStep] = useState(1);

    const [lookingFor, setLookingFor] = useState<LookingFor>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [headline, setHeadline] = useState("");
    const [companyHeadline, setCompanyHeadline] = useState("");

    const background = {
        image: "",
        color: "",
    };

    switch (step) {
        case 1:
            background.image = "/static/backgrounds/grey.svg";
            background.color = "var(--colorAthensGrey)";
            break;
        case 2:
            background.image = "/static/backgrounds/purple.svg";
            background.color = "var(--colorBlueViolet)";
            break;
        case 3:
            background.image = "/static/backgrounds/red.svg";
            background.color = "var(--colorMandy)";
            break;
        case 4:
            background.image = "/static/backgrounds/steel-grey.svg";
            background.color = "var(--colorSteelGrey)";
            break;
    }

    useEffect(() => {
        if (appStore?.user) {
            setLookingFor(appStore?.user?.MSPshipObjectives?.lookingFor);
            setFirstName(appStore?.user?.basicInfo?.firstName);
            setLastName(appStore?.user?.basicInfo?.lastName);
            setPronouns(appStore?.user?.basicInfo?.pronouns);
            setHeadline(appStore?.user?.basicInfo?.headline);
            setCompanyHeadline(appStore?.user?.basicInfo?.companyHeadline);
        }
    }, [appStore?.user]);

    const confirmLookingFor = async () => {
        setIsSaving(true);

        try {
            await userService.updateUserProfile(appStore?.user?.user?.id, {
                MSPshipObjectives: {
                    lookingFor,
                },
            });

            setStep(2);
        } catch (error) {
            showServerError(error);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmBasicProfile = async () => {
        setIsSaving(true);

        const basicInfo = omitBy(
            {
                firstName,
                lastName,
                pronouns,
            },
            isEmpty
        );

        try {
            await userService.updateUserProfile(appStore?.user?.user?.id, {
                basicInfo,
            });

            setStep(3);
        } catch (error) {
            showServerError(error);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmHeadlines = async () => {
        setIsSaving(true);

        const basicInfo = omitBy(
            {
                headline,
                companyHeadline,
            },
            isEmpty
        );

        try {
            await userService.updateUserProfile(appStore?.user?.user?.id, {
                basicInfo,
            });

            await authService.connect(appStore?.user?.user?.ref);

            setStep(4);
        } catch (error) {
            showServerError(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url("${background.image}")`,
                backgroundColor: background.color,
            }}
        >
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <ActiveLink href="/">
                        <Logo
                            className={classNames(
                                styles.logo,
                                step !== 1 && styles.inverseLogo
                            )}
                        />
                    </ActiveLink>
                </div>
            </div>
            <main className={styles.main}>
                {step === 1 && (
                    <div className={styles.selectionGroup}>
                        <div className={styles.headerSection}>
                            <h1 className={styles.title}>Let’s get started!</h1>
                            <p className={styles.subTitle}>
                                How do you want to participate in the community?
                            </p>
                        </div>
                        <ul className={styles.selections}>
                            <li className={styles.selectionItem}>
                                <button
                                    type="button"
                                    className={classNames(
                                        styles.selectButton,
                                        lookingFor === LookingFor.Mentee && styles.selectedButton
                                    )}
                                    onClick={() => setLookingFor(LookingFor.Mentee)}
                                >
                                    <StarClusterTeal
                                        className={classNames(
                                            styles.selectIcon,
                                            lookingFor === LookingFor.Mentee && styles.selectedIcon
                                        )}
                                        width={44}
                                        height={56}
                                    />
                                    <span>I want to MSP others</span>
                                </button>
                            </li>
                            <li className={styles.selectionItem}>
                                <button
                                    type="button"
                                    className={classNames(
                                        styles.selectButton,
                                        lookingFor === LookingFor.MSP && styles.selectedButton
                                    )}
                                    onClick={() => setLookingFor(LookingFor.MSP)}
                                >
                                    <StarClusterPurple
                                        className={classNames(
                                            styles.selectIcon,
                                            lookingFor === LookingFor.MSP && styles.selectedIcon
                                        )}
                                        width={44}
                                        height={56}
                                    />
                                    <span>I want to find a MSP</span>
                                </button>
                            </li>
                            <li className={styles.selectionItem}>
                                <button
                                    type="button"
                                    className={classNames(
                                        styles.selectButton,
                                        lookingFor === LookingFor.MSPMentee &&
                                        styles.selectedButton
                                    )}
                                    onClick={() => setLookingFor(LookingFor.MSPMentee)}
                                >
                                    <StarClusterOrange
                                        className={classNames(
                                            styles.selectIcon,
                                            lookingFor === LookingFor.MSPMentee &&
                                            styles.selectedIcon
                                        )}
                                        width={44}
                                        height={56}
                                    />
                                    <span>
                    I want to MSP others AND I want to find a MSP
                  </span>
                                </button>
                            </li>
                            <li className={styles.selectionItem}>
                                <button
                                    type="button"
                                    className={classNames(
                                        styles.selectButton,
                                        lookingFor === LookingFor.Recruit && styles.selectedButton
                                    )}
                                    onClick={() => setLookingFor(LookingFor.Recruit)}
                                >
                                    <StarClusterRed
                                        className={classNames(
                                            styles.selectIcon,
                                            lookingFor === LookingFor.Recruit && styles.selectedIcon
                                        )}
                                        width={44}
                                        height={56}
                                    />
                                    <span>I’m recruiting on behalf of an organization(s)</span>
                                </button>
                            </li>
                            <li className={styles.selectionItem}>
                                <button
                                    type="button"
                                    className={classNames(
                                        styles.selectButton,
                                        lookingFor === LookingFor.BuildingNetwork &&
                                        styles.selectedButton
                                    )}
                                    onClick={() => setLookingFor(LookingFor.BuildingNetwork)}
                                >
                                    <StarClusterGreen
                                        className={classNames(
                                            styles.selectIcon,
                                            lookingFor === LookingFor.BuildingNetwork &&
                                            styles.selectedIcon
                                        )}
                                        width={44}
                                        height={56}
                                    />
                                    <span>
                    I’m just interested in building a MSPship network
                  </span>
                                </button>
                            </li>
                        </ul>
                        <div className={styles.actionSection}>
                            <ContainedButton
                                onClick={confirmLookingFor}
                                icon="arrowRight"
                                iconPosition="right"
                                disabled={!lookingFor || isSaving}
                            >
                                Next
                            </ContainedButton>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div
                        className={classNames(styles.selectionGroup, styles.inverseColor)}
                    >
                        <div className={styles.headerSection}>
                            <h1 className={styles.title}>What’s your name and pronouns?</h1>
                            <p className={styles.inverseSubTitle}>All are welcome here!</p>
                        </div>
                        <ul className={styles.selections}>
                            <li className={styles.selectionItem}>
                                <label htmlFor="firstName">
                                    <span className={styles.labelText}>First Name</span>
                                    <input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter first name"
                                    />
                                </label>
                            </li>
                            <li className={styles.selectionItem}>
                                <label htmlFor="lastName">
                                    <span className={styles.labelText}>Last Name</span>
                                    <input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter last name"
                                    />
                                </label>
                            </li>
                            <li className={styles.selectionItem}>
                                <label htmlFor="pronouns">
                                    <span className={styles.labelText}>Pronouns (optional)</span>
                                    <input
                                        id="pronouns"
                                        value={pronouns}
                                        onChange={(e) => setPronouns(e.target.value)}
                                        placeholder="ex. She/Her or They/Them"
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className={styles.actionSection}>
                            <ContainedButton
                                onClick={confirmBasicProfile}
                                icon="arrowRight"
                                iconPosition="right"
                                disabled={!firstName || !lastName || isSaving}
                            >
                                Next
                            </ContainedButton>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div
                        className={classNames(styles.selectionGroup, styles.inverseColor)}
                    >
                        <div className={styles.headerSection}>
                            <h1 className={styles.title}>Thanks, {firstName}!</h1>
                            <p className={styles.inverseSubTitle}>
                                Let the community know what you do.
                            </p>
                        </div>
                        <ul className={styles.selections}>
                            <li className={styles.selectionItem}>
                                <label htmlFor="headline">
                                    <span className={styles.labelText}>Headline</span>
                                    <input
                                        id="headline"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        placeholder="Role, title, student, etc"
                                    />
                                </label>
                            </li>
                            <li className={styles.selectionItem}>
                                <label htmlFor="companyHeadline">
                  <span className={styles.labelText}>
                    Company / Org / School
                  </span>
                                    <input
                                        id="companyHeadline"
                                        value={companyHeadline}
                                        onChange={(e) => setCompanyHeadline(e.target.value)}
                                        placeholder="Enter company / org / school"
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className={styles.actionSection}>
                            <ContainedButton
                                onClick={confirmHeadlines}
                                icon="arrowRight"
                                iconPosition="right"
                                disabled={!headline || !companyHeadline || isSaving}
                                inverse={true}
                            >
                                Next
                            </ContainedButton>
                        </div>
                    </div>
                )}
                {step === 4 && (
                    <div
                        className={classNames(styles.selectionGroup, styles.inverseColor)}
                    >
                        <div className={styles.headerSection}>
                            <Tada width={116} height={116}/>
                            <h1 className={styles.largeTitle}>Congrats!</h1>
                            <p className={styles.inverseSubTitle}>
                                Welcome to your MSPship network.
                            </p>
                        </div>
                        <div className={styles.finalActionSection}>
                            <ContainedLinkButton
                                href="/ms/conversations/"
                                icon="arrowRight"
                                iconPosition="right"
                                disabled={!headline || !companyHeadline || isSaving}
                            >
                                Begin Exploring the App
                            </ContainedLinkButton>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
});

export default withLogin(Page);
