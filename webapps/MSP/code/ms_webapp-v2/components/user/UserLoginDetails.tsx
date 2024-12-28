import React from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";

interface Props {
  user: IProfile;
}

const UserLoginDetails = observer(({ user }: Props) => {
  return (
    <FormGroup>
      <h2 className="header">Login Details</h2>
      <Label label="Last Login" htmlFor="lastLogin" shiftLabel={false}>
        {user?.user?.lastLogin}
      </Label>
      <Label label="Claim Code" htmlFor="claimCode" shiftLabel={false}>
        {user?.claimCode || "–"}
      </Label>
    </FormGroup>
  );
});

export default UserLoginDetails;
