import { useRouter } from "next/router";
import { ICompany } from "ms-npm/admin-models";
import { isEmpty, omitBy } from "lodash";
import { CompanyCategory } from "ms-npm/company-models";

import { IMoreAction } from "../components/core/MoreActions";
import useAdminStores from "../stores/admin-context";
import useToast from "./use-toast";
import adminService from "../services/admin-service";
import { IMediaCrop } from "../@types/Media";
import mediaService from "../services/media-service";
import orgService from "../services/org-service";

const useAdminOrgLogic = () => {
  const { adminOrgsStore } = useAdminStores();
  const { showSuccessMessage, showServerError } = useToast();

  const router = useRouter();

  const onExpandOrgProfile = (data: ICompany) => {
    adminOrgsStore.setOrg(data);
    adminOrgsStore.setProfileDetailTab("profile");
    adminOrgsStore.setIsProfileDetailFlyoutOpen(true);
  };

  const onSearch = (text: string) => {
    adminOrgsStore.setSearchQuery(text);
    adminOrgsStore.fetchData();
  };

  const onEditCompany = (data: ICompany) => {
    router
      .push(`/admin/orgs/${data?.id}/info`, `/admin/orgs/${data?.id}/info`)
      .then(() => window.scrollTo(0, 0));
  };

  const onMessageAdmin = (data: ICompany) => {
    console.info(data);
  };

  const onDeactivateOrg = (data: ICompany) => {
    adminOrgsStore.setOrg(data);
    adminOrgsStore.setModalState({
      type: "deactivate",
      isOpen: true,
    });
  };

  const onDeactivateConfirm = async (data: ICompany) => {
    try {
      await orgService.updateOrgInfo(data?.info?.id, {
        status: "archived",
      });
    } catch (error) {
      showServerError(error);
    }

    showSuccessMessage({
      title: "Company Deactivated",
      message: "This company has been successfully deactivated.",
    });

    adminOrgsStore.reset();
  };

  const onAddOrg = () => {
    adminOrgsStore.setModalState({
      type: "addOrg",
      isOpen: true,
    });
  };

  const onAddOrgConfirm = async (org: {
    admin: { userId: number };
    status?: string;
    info: {
      name: string;
      category?: CompanyCategory;
    };
    established?: number;
    city?: string;
    state?: string;
    bio?: string;
    video?: string;
    website?: string;
    linkedIn?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    imageFile?: File;
    imageCrop?: IMediaCrop;
  }) => {
    try {
      const cleanData = omitBy(
        {
          admin: org?.admin,
          info: org?.info,
          established: org?.established,
          city: org?.city,
          state: org?.state,
          status: org?.status,
          bio: org?.bio,
          video: org?.video,
          website: org?.website,
          linkedIn: org?.linkedIn,
          facebook: org?.facebook,
          instagram: org?.instagram,
          twitter: org?.twitter,
        },
        isEmpty
      );
      const res = await adminService.addOrg(cleanData);

      if (org?.imageFile && org?.imageCrop) {
        const formData = new FormData();

        formData.append("x", org?.imageCrop?.x.toString());
        formData.append("y", org?.imageCrop?.y.toString());
        formData.append("width", org?.imageCrop?.width.toString());
        formData.append("height", org?.imageCrop?.height.toString());
        formData.append("image", org?.imageFile);

        const mediaRes = await mediaService.uploadOrgProfilePhoto(
          res?.data?.result?.companyId,
          formData
        );

        await orgService.updateOrgInfo(res?.data?.result?.id, {
          photo: mediaRes?.data?.url,
        });
      }

      showSuccessMessage({
        title: "Company Added",
        message: "This company has been successfully added.",
      });

      adminOrgsStore.reset();
      adminOrgsStore.fetchData();
    } catch (error) {
      showServerError(error);
    }
  };

  const orgActions: IMoreAction[] = [
    {
      key: "messageAdmin",
      name: "Message Admin",
      icon: "message",
      onClick: onMessageAdmin,
      hideIf: [
        {
          key: "status",
          value: "deactivated",
        },
      ],
    },
    {
      key: "editCompany",
      name: "Edit Company",
      icon: "edit",
      onClick: onEditCompany,
      hideIf: [
        {
          key: "status",
          value: "deactivated",
        },
      ],
    },
    {
      key: "deactivate",
      name: "Deactivate Company",
      icon: "trash",
      onClick: onDeactivateOrg,
      isDestructive: true,
    },
  ];

  return {
    onExpandOrgProfile,
    onSearch,
    onEditCompany,
    onMessageAdmin,
    onDeactivateOrg,
    onDeactivateConfirm,
    onAddOrg,
    onAddOrgConfirm,
    orgActions,
  };
};

export default useAdminOrgLogic;
