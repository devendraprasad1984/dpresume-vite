import React, { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { removeAuthorization, removeMetadata } from "../services/api";
import useAppStores from "../stores/app-context";

import appEnvConstants from "../services/app-env-constants";

const useAuth = () => {
  const { appStore } = useAppStores();
  const { logout } = useAuth0();

  const signOut = useCallback(() => {
    removeMetadata();
    removeAuthorization();
    logout({ returnTo: appEnvConstants.baseUrl });
    appStore.setUser(null);
  }, []);

  return {
    signOut,
  };
};

export default useAuth;
