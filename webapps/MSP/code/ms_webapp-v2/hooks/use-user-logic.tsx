import { useRouter } from "next/router";

import messageService from "../services/message-service";
import useAppStores from "../stores/app-context";
import useToast from "./use-toast";

const useUserLogic = () => {
  const { appStore } = useAppStores();
  const { showServerError, showSuccessMessage } = useToast();
  const router = useRouter();

  const onConnect = async ({ ref, name }: { ref: string; name: string }) => {
    try {
      await messageService.createChannel({
        members: [appStore?.user?.user?.ref, ref],
        name: `${appStore?.user?.basicInfo?.firstName}, ${name}`,
      });

      showSuccessMessage({
        title: "Connection Requested",
        message: "Your request to connect with this user has been sent.",
      });
    } catch (error) {
      showServerError(error);
    }
  };

  const onConnectOrg = async () => {
    showSuccessMessage({
      title: "Connection Requested",
      message: "Your request to connect with this company has been sent.",
    });
  };

  const onMessage = async (ref: string) => {
    router
      .push(`/ms/conversations/?channel=${ref}`)
      .then(() => window.scrollTo(0, 0));
  };

  return {
    onConnect,
    onConnectOrg,
    onMessage,
  };
};

export default useUserLogic;
