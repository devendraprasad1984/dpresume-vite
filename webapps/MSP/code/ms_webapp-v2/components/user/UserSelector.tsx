import React, {useState, useReducer, useEffect, useCallback} from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";

import styles from "./UserSelector.module.scss";
import CheckBox from "../form/CheckBox";
import Avatar from "../core/Avatar";
import UserProfileName from "../core/UserProfileName";
import fullName from "../../utils/full-name";
import Search from "../core/Search";
import {IPeopleSearchForUI} from "../../@types/Users";
import userService from "../../services/user-service";
import useAppStores from "../../stores/app-context";

interface Props {
    label?: string;
    idType: "id" | "ref" | "user";
    existingUserIDs?: number[];
    existingUserRefs?: string[];
    onSelect: (users: number[] | string[] | IPeopleSearchForUI[]) => void;
    filter: "connectedWithMe" | "notConnectedWithMe" | "peopleSearch";
    showMeOnTop: boolean;
}

const UserSelector = observer(
    ({
         label,
         idType,
         existingUserIDs,
         existingUserRefs,
         onSelect,
         filter,
         showMeOnTop,
     }: Props) => {
        const {appStore} = useAppStores();
        const [users, setUsers] = useState<IPeopleSearchForUI[]>([]);

        const [selectedIDs, selectIDsDispatch] = useReducer(
            (
                state: number[],
                {type, payload}: { type: string; payload: number }
            ) => {
                switch (type) {
                    case "add":
                        return uniq([...state, payload]);
                    case "remove":
                        return state?.filter((item) => item !== payload);
                    default:
                        return state;
                }
            },
            []
        );

        const [selectedRefs, selectRefsDispatch] = useReducer(
            (
                state: string[],
                {type, payload}: { type: string; payload: string }
            ) => {
                switch (type) {
                    case "add":
                        return uniq([...state, payload]);
                    case "remove":
                        return state?.filter((item) => item !== payload);
                    default:
                        return state;
                }
            },
            []
        );

        const [selectedUsers, selectUsersDispatch] = useReducer(
            (
                state: IPeopleSearchForUI[],
                {type, payload}: { type: string; payload: IPeopleSearchForUI }
            ) => {
                switch (type) {
                    case "add":
                        return uniqBy([...state, payload], "ref");
                    case "remove":
                        return state?.filter((item) => item?.ref !== payload?.ref);
                    default:
                        return state;
                }
            },
            []
        );

        const fetchUsers = useCallback(
            async (q?: string) => {
                try {
                    const res = await userService.fetchUsers({
                        filter: filter,
                        perPage: 100,
                        data: {
                            keyword: q,
                        },
                    });

                    const members = res?.data?.result?.data?.map((item) => ({
                        ...item,
                        name: fullName([item?.firstName, item?.lastName]),
                    }));

                    if (showMeOnTop && !q) {
                        const user: IPeopleSearchForUI = {
                            userId: appStore?.user?.userId,
                            profileId: appStore?.user?.id,
                            role: null,
                            ref: appStore?.user?.ref,
                            name: fullName([
                                appStore?.user?.basicInfo?.firstName,
                                appStore?.user?.basicInfo?.lastName,
                            ]),
                            firstName: appStore?.user?.basicInfo?.firstName,
                            lastName: appStore?.user?.basicInfo?.lastName,
                            pronouns: appStore?.user?.basicInfo?.pronouns,
                            headline: appStore?.user?.basicInfo?.headline,
                            companyHeadline: appStore?.user?.basicInfo?.companyHeadline,
                            picture: appStore?.user?.basicInfo?.picture,
                            lookingFor: appStore?.user?.MSPshipObjectives?.lookingFor,
                            connectStatus: null,
                            isOnline: true,
                        };

                        setUsers([user, ...members]);
                    } else {
                        setUsers(members);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            [
                appStore?.user?.basicInfo?.companyHeadline,
                appStore?.user?.basicInfo?.firstName,
                appStore?.user?.basicInfo?.headline,
                appStore?.user?.basicInfo?.lastName,
                appStore?.user?.basicInfo?.picture,
                appStore?.user?.basicInfo?.pronouns,
                appStore?.user?.id,
                appStore?.user?.MSPshipObjectives?.lookingFor,
                appStore?.user?.ref,
                appStore?.user?.userId,
                filter,
                showMeOnTop,
            ]
        );

        const onChange = (isChecked: boolean, user: IPeopleSearchForUI) => {
            if (idType === "id") {
                const payload = user?.userId;

                if (isChecked) {
                    selectIDsDispatch({
                        type: "remove",
                        payload,
                    });
                } else {
                    selectIDsDispatch({
                        type: "add",
                        payload,
                    });
                }
            } else if (idType === "ref") {
                const payload = user?.ref;

                if (isChecked) {
                    selectRefsDispatch({
                        type: "remove",
                        payload,
                    });
                } else {
                    selectRefsDispatch({
                        type: "add",
                        payload,
                    });
                }
            } else if (idType === "user") {
                const payload = user;

                if (isChecked) {
                    selectUsersDispatch({
                        type: "remove",
                        payload,
                    });
                } else {
                    selectUsersDispatch({
                        type: "add",
                        payload,
                    });
                }
            }
        };

        useEffect(() => {
            fetchUsers();
        }, [fetchUsers]);

        useEffect(() => {
            if (idType === "id") {
                onSelect(selectedIDs);
            } else if (idType === "ref") {
                onSelect(selectedRefs);
            } else if (idType === "user") {
                onSelect(selectedUsers);
            }
        }, [onSelect, idType, selectedIDs, selectedRefs, selectedUsers]);

        return (
            <div className={styles.container}>
                <div className={styles.searchSection}>
                    <Search onChange={fetchUsers}/>
                </div>
                {label && <p className={styles.title}>{label}</p>}
                <ul className={styles.userList}>
                    {users?.map((item) => {
                        const isExisting =
                            existingUserIDs?.includes(item?.userId) ||
                            existingUserRefs?.includes(item?.ref);

                        const isChecked =
                            selectedIDs.includes(item?.userId) ||
                            selectedRefs.includes(item?.ref) ||
                            selectedUsers?.map((item) => item?.ref)?.includes(item?.ref) ||
                            isExisting;
                        const isDisabled = isExisting;
                        return (
                            <li key={item?.userId}>
                                <CheckBox
                                    className={classNames(
                                        styles.userListItem,
                                        isDisabled && styles.disabledItem
                                    )}
                                    offset={true}
                                    id={`user-select-${item?.userId}`}
                                    isChecked={isChecked}
                                    onChange={() => onChange(isChecked, item)}
                                    alignment="right"
                                    disabled={isDisabled}
                                >
                                    <div className={styles.userItem}>
                                        <Avatar
                                            size="s"
                                            firstName={item?.firstName}
                                            lastName={item?.lastName}
                                            src={item?.picture}
                                        />
                                        <div className={styles.userMeta}>
                                            <UserProfileName
                                                mode="listItem"
                                                firstName={item?.firstName}
                                                lastName={item?.lastName}
                                                pronouns={item?.pronouns}
                                            />
                                            <div className={styles.headlines}>
                                                <span>{item?.headline}</span>
                                                {item?.headline && <span>&bull;</span>}
                                                <span>{item?.companyHeadline}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CheckBox>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
);

export default UserSelector;
