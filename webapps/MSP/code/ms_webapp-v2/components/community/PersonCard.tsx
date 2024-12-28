import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {PeopleConnectedStatus} from "ms-npm/search-models";

import styles from "./PersonCard.module.scss";
import Avatar from "../core/Avatar";
import SaveButton from "../buttons/SaveButton";
import OutlineButton from "../buttons/OutlineButton";
import ProfileChip from "../core/ProfileChip";
import useUserLogic from "../../hooks/use-user-logic";
import {IPeopleSearchForUI} from "../../@types/Users";
import ActiveLink from "../core/ActiveLink";

interface Props {
    person: IPeopleSearchForUI;
}

const PersonCard = observer(({person}: Props) => {
    const {onConnect, onMessage} = useUserLogic();
    const [hasRequestSent, setHasRequestSent] = useState(false);

    const connect = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setHasRequestSent(true);

        try {
            await onConnect({ref: person?.ref, name: person?.name});
        } catch (error) {
            setHasRequestSent(false);
        }
    };

    const message = (e) => {
        e.preventDefault();
        e.stopPropagation();

        onMessage(person?.ref);
    };

    const save = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <ActiveLink
            href={`/ms/people/${person?.userId}`}
            className={styles.container}
        >
            <div className={styles.avatarGroup}>
                <Avatar
                    firstName={person?.firstName}
                    lastName={person?.lastName}
                    size="xl"
                    isOnline={person?.isOnline}
                    showOnlineStatus={person?.isOnline !== null}
                    src={person?.picture}
                />
                <SaveButton subtle={true} onClick={save}/>
            </div>
            <div className={styles.metadata}>
                <div className={styles.namePronoun}>
                    <p className={styles.userName}>
                        <span>{person.name}</span>
                        {person.pronouns && (
                            <span className={styles.pronouns}>({person?.pronouns})</span>
                        )}
                    </p>
                </div>
                <p className={styles.headline}>{person?.headline}</p>
                <p className={styles.org}>{person?.companyHeadline}</p>
            </div>
            <div className={styles.actions}>
                <ProfileChip>I’m looking for a MSP</ProfileChip>
                {person?.connectStatus === PeopleConnectedStatus.Connected && (
                    <OutlineButton size="S" onClick={message}>
                        Message
                    </OutlineButton>
                )}
                {person?.connectStatus === PeopleConnectedStatus.NotConnected &&
                    !hasRequestSent && (
                        <OutlineButton size="S" onClick={connect} disabled={hasRequestSent}>
                            Connect
                        </OutlineButton>
                    )}
                {(person?.connectStatus === PeopleConnectedStatus.Pending ||
                    hasRequestSent) && (
                    <OutlineButton size="S" disabled={true}>
                        Pending
                    </OutlineButton>
                )}
            </div>
        </ActiveLink>
    );
});

export default PersonCard;
