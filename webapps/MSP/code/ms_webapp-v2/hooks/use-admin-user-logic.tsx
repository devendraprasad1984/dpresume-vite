import { useRouter } from "next/router";

import useAdminStores from "../stores/admin-context";
import { IMoreAction } from "../components/core/MoreActions";
import adminService from "../services/admin-service";
import useToast from "./use-toast";
import { IUserSearchForUI } from "../@types/Admin";
import userService from "../services/user-service";

const useAdminUserLogic = () => {
  const { adminUsersStore, adminUserStore } = useAdminStores();
  const { showServerError, showSuccessMessage } = useToast();
  const router = useRouter();

  const onSearch = (text: string) => {
    adminUsersStore.setSearchQuery(text);
    adminUsersStore.fetchData();
  };

  const onExpandUserProfile = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setProfileDetailTab("profile");
    adminUsersStore.setIsProfileDetailFlyoutOpen(true);
  };

  const onEditProfile = (data: IUserSearchForUI) => {
    adminUserStore.reset();

    router
      .push(`/admin/users/${data?.id}/public/`)
      .then(() => window.scrollTo(0, 0));
  };

  const onSuspendUser = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setModalState({
      type: "suspend",
      isOpen: true,
    });
  };

  const onSuspendUserConfirm = async (data: IUserSearchForUI) => {
    try {
      await userService.updateUser(data?.id, {
        status: "suspended",
      });

      showSuccessMessage({
        title: "User Suspended",
        message: "This user has been successfully suspended.",
      });

      adminUsersStore.reset();
    } catch (error) {
      showServerError(error);
    }
  };

  const onActivateUser = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setModalState({
      type: "activate",
      isOpen: true,
    });
  };

  const onActivateUserConfirm = async (data: IUserSearchForUI) => {
    try {
      await userService.updateUser(data?.id, {
        status: "active",
      });

      showSuccessMessage({
        title: "User Activated",
        message: "This user has been successfully activated.",
      });

      adminUsersStore.reset();
    } catch (error) {
      showServerError(error);
    }
  };

  const onAddNote = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setModalState({
      type: "addNote",
      isOpen: true,
    });
  };

  const onAddNoteConfirm = async (newNote: string) => {
    const body = {
      userId: adminUserStore?.user?.id,
      status: "active",
      text: newNote,
    };
    try {
      await adminService.addNote(body);
      showSuccessMessage({
        title: "Note Added",
        message: "New note has been successfully added.",
      });
      adminUsersStore.reset();
    } catch (error) {
      showServerError(error);
      adminUsersStore.reset();
    }
  };

  const onChangeRole = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setModalState({
      type: "changeRole",
      isOpen: true,
    });
  };

  const onChangeRoleConfirm = async (data: {
    role: string;
    user: IUserSearchForUI;
  }) => {
    try {
      await userService.updateUser(data?.user?.id, {
        role: data?.role,
      });

      showSuccessMessage({
        title: "Role Updated",
        message: "This user’s role has been successfully updated.",
      });

      adminUsersStore.reset();
    } catch (error) {
      showServerError(error);
    }
  };

  const onArchiveUser = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setModalState({
      type: "archive",
      isOpen: true,
    });
  };

  const onUnarchiveUser = (data: IUserSearchForUI) => {
    adminUsersStore.setUser(data);
    adminUsersStore.setModalState({
      type: "unarchive",
      isOpen: true,
    });
  };

  const onArchiveUserConfirm = async (data: IUserSearchForUI) => {
    try {
      await userService.updateUser(data?.id, {
        status: "archived",
      });

      showSuccessMessage({
        title: "User Archived",
        message: "This user has been successfully archived.",
      });

      adminUsersStore.reset();
    } catch (error) {
      showServerError(error);
    }
  };

  const onUnArchiveUserConfirm = async (data: IUserSearchForUI) => {
    try {
      await userService.updateUser(data?.id, {
        status: "active",
      });

      showSuccessMessage({
        title: "User Unarchived",
        message: "This user has been successfully unarchived.",
      });

      adminUsersStore.reset();
    } catch (error) {
      showServerError(error);
    }
  };

  const userActions: IMoreAction[] = [
    {
      key: "editProfile",
      name: "Edit Profile",
      icon: "edit",
      onClick: onEditProfile,
      hideIf: [
        {
          key: "status",
          value: "archived",
        },
      ],
    },
    {
      key: "suspendUser",
      name: "Suspend User",
      icon: "pause",
      onClick: onSuspendUser,
      hideIf: [
        {
          key: "status",
          value: "suspended",
        },
        {
          key: "status",
          value: "archived",
        },
      ],
    },
    {
      key: "activateUser",
      name: "Activate User",
      icon: "restore",
      onClick: onActivateUser,
      hideIf: [
        {
          key: "status",
          value: "active",
        },
        {
          key: "status",
          value: "archived",
        },
      ],
    },
    {
      key: "addNote",
      name: "Add Note",
      icon: "note",
      onClick: onAddNote,
      hideIf: [
        {
          key: "status",
          value: "archived",
        },
      ],
    },
    {
      key: "changeRole",
      name: "Change Role",
      icon: "key",
      onClick: onChangeRole,
      hideIf: [
        {
          key: "status",
          value: "archived",
        },
      ],
    },
    {
      key: "unArchiveUser",
      name: "Unarchive User",
      icon: "restore",
      onClick: onUnarchiveUser,
      hideIf: [
        {
          key: "status",
          value: "active",
        },
        {
          key: "status",
          value: "suspended",
        },
      ],
    },
    {
      key: "archiveUser",
      name: "Archive User",
      icon: "trash",
      onClick: onArchiveUser,
      isDestructive: true,
      hideIf: [
        {
          key: "status",
          value: "archived",
        },
      ],
    },
  ];

  return {
    onSearch,
    onExpandUserProfile,
    onEditProfile,
    onSuspendUser,
    onActivateUser,
    onActivateUserConfirm,
    onSuspendUserConfirm,
    onAddNote,
    onAddNoteConfirm,
    onChangeRole,
    onChangeRoleConfirm,
    onArchiveUser,
    onUnarchiveUser,
    onArchiveUserConfirm,
    onUnArchiveUserConfirm,
    userActions,
  };
};

export default useAdminUserLogic;
