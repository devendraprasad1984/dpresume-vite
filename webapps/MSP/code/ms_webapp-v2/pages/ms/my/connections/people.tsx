import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../../components/core/WithLogin";
import UserLayout from "../../../../components/user/UserLayout";
import ProfileSidebar from "../../../../components/my/ProfileSidebar";
import useToast from "../../../../hooks/use-toast";
import userService from "../../../../services/user-service";
import styles from "./people.module.scss";
import PersonCard from "../../../../components/community/PersonCard";
import MyConnectionsWithNav from "../../../../components/my/MyConnectionsWithNav";
import { IPeopleSearchForUI } from "../../../../@types/Users";
import fullName from "../../../../utils/full-name";

const Page = observer(() => {
  const { showServerError } = useToast();
  const [people, setPeople] = useState<IPeopleSearchForUI[]>([]);

  const getPeople = useCallback(async () => {
    try {
      const res = await userService.fetchUsers({
        filter: "connectedWithMe",
      });
      setPeople(
        res?.data?.result?.data?.map((item) => ({
          ...item,
          name: fullName([item?.firstName, item?.lastName]),
        }))
      );
    } catch (error) {
      showServerError(error);
    }
  }, [showServerError]);

  useEffect(() => {
    getPeople();
  }, [getPeople]);

  return (
    <UserLayout>
      <ProfileSidebar>
        <MyConnectionsWithNav>
          <div className={styles.people}>
            {people?.map((item) => (
              <PersonCard key={item?.ref} person={item} />
            ))}
          </div>
        </MyConnectionsWithNav>
      </ProfileSidebar>
    </UserLayout>
  );
});

export default withLogin(Page);
