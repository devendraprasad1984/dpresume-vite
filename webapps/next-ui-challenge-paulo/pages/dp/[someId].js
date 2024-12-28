import React from "react";
import { useRouter } from "next/router";
import HeaderLine from "../../core/headeline";

const DynamicIdRoute = () => {
  const router = useRouter();
  const pageId = router.query.someId;

  return <HeaderLine title={`Dynamic Routes Check ${pageId}`} />;
};

export default DynamicIdRoute;
