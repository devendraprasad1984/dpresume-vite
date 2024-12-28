import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import LoadingScreen from "../../components/core/LoadingScreen";

const Page = observer(() => {
  const router = useRouter();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem("redirectPath");
    if (redirectPath) {
      router.push(redirectPath).then(() => window.scrollTo(0, 0));
    } else {
      router.push("/").then(() => window.scrollTo(0, 0));
    }
  }, [router]);

  return <LoadingScreen />;
});

export default Page;
