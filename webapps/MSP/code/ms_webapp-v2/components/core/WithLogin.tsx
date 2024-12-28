import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

import LoadingScreen from "../../components/core/LoadingScreen";
import authService from "../../services/auth-service";
import { setMetadata, setAuthorization } from "../../services/api";
import useAppStores from "../../stores/app-context";

const WithLogin = ({ children }) => {
  const { appStore } = useAppStores();
  const {
    isLoading,
    loginWithRedirect,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !isEmpty(appStore?.user)
  );

  const tryLogin = useCallback(async () => {
    try {
      // Access token from Auth0
      const accessToken = await getAccessTokenSilently();

      // Metadata from back-end
      const res = await authService.validate(accessToken);
      const { initialized, metadata, onboarded } = res?.data?.result;

      setAuthorization(accessToken);
      setMetadata(metadata);

      appStore?.setInitialized(initialized);
      appStore?.setOnboarded(onboarded);

      // Signed-in User profile
      await appStore?.fetchUserData();

      setIsLoggedIn(true);

      if (!onboarded) {
        router.push("/ms/onboarding/").then(() => window.scrollTo(0, 0));
      }
    } catch (error) {
      console.error(error);
    }
  }, [appStore, getAccessTokenSilently, router]);

  const checkLogin = useCallback(async () => {
    if (isLoading) return;

    if (isAuthenticated && !isLoggedIn) {
      tryLogin();
    } else if (!isAuthenticated) {
      // User needs to re-authenticate with the Auth0 Universal Login
      sessionStorage.setItem("redirectPath", router.pathname);
      await loginWithRedirect();
    }
  }, [
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    isLoggedIn,
    tryLogin,
    router.pathname,
  ]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  if (isLoggedIn) return children;

  return <LoadingScreen />;
};

const withLogin = (Component) => {
  const WithLoginComponent = (props) => {
    return (
      <WithLogin>
        <Component {...props} />
      </WithLogin>
    );
  };

  WithLoginComponent.displayName = `withLogin(${
    Component.displayName || Component.name || "Component"
  }`;
  return WithLoginComponent;
};

export default withLogin;
