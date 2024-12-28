import React from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../components/core/WithLogin";
import UserLayout from "../../../components/user/UserLayout";
import ProfileSidebar from "../../../components/my/ProfileSidebar";
import MyPageHeader from "../../../components/my/MyPageHeader";

const Page = observer(() => {
  return (
    <UserLayout>
      <ProfileSidebar>
        <MyPageHeader title={"Help"} />
      </ProfileSidebar>
    </UserLayout>
  );
});

export default withLogin(Page);
