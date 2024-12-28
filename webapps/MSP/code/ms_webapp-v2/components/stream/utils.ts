import dayjs from "dayjs";

export const Enum: any = {
  x18: 18,
  x24: 24,
  x30: 30,
  x70: 70,
  ChannelType: {
    Group: "Group",
    Topic: "Topic",
  },
  OverlayEnum: {
    search: "search",
    seeAllMembers: "seeAllMembers",
    seeAllRequests: "seeAllRequests",
  },
  archive: {
    errorTitle: "Error Archiving",
    errorMessage: "The conversation could not be archived or no longer exists",
    successTitle: "Conversation Archived",
    successMessage: "The conversation is archived",
  },
  scheduleVideoCall: {
    errorTitle: "Error Scheduling",
    errorMessage: "Cannot be scheduled at this time, please try again later",
    successTitle: "Video Scheduled",
    successMessage:
      "Video call has been scheduled, We will notify you about this on time.",
  },
  delete: {
    errorTitle: "Error Deleting",
    errorMessage: "The conversation could not be deleted",
    successTitle: "Conversation Deleted",
    successMessage: "The conversation is deleted",
  },
  groupNameUpdate: {
    errorTitle: "Error Updating Group Name",
    errorMessage:
      "Group name cant be updated at this, kindly retry after some time",
    successTitle: "Group Name Updated",
    successMessage: "Your group name has been updated",
  },
  groupInvite: {
    errorTitle: "Error sending Group Invite",
    errorMessage: "Users cant be invited at this time, try again later",
    successTitle: "Group Invite",
    successMessage: "Users invited",
  },
  flag: {
    errorTitle: "Error Flagging",
    errorMessage: "Could not be flagged",
    successTitle: "Conversation Flagged",
    successMessage: "The conversation was Flagged",
  },
  urlCopy: {
    errorTitle: "Error Copying url",
    errorMessage: "Could not copied",
    successTitle: "Topic url copies",
    successMessage: "Link copied to clipboard",
  },
  mute: {
    errorTitle: "Error muting",
    errorMessage: "Could not be muted",
    successTitle: "Conversation Muted",
    successMessage: "You will no longer receive notifications for new messages",
  },
  unmute: {
    errorTitle: "Error unmuting",
    errorMessage: "Could not be un-muted",
    successTitle: "Conversation Un-Muted",
    successMessage: "You will have notifications again for new messages",
  },
  editGroupName: {
    failedTitle: "Information",
    failedMessage:
      "Only group creator is allowed to edit group name at this time",
  },
  ModalMessages: {
    dummy: { title: "yet to clarify", body: "yet to clarify" },
    group: {
      makeModerator: (name?: string) => ({
        title: `Make Moderator?`,
        body: `Are you sure you want to make ${name} a group moderator? They will be able to manage group members and rename the group.`,
      }),
      removeModerator: (name?: string) => ({
        title: `Remove Moderator Role?`,
        body: `Are you sure you want to remove moderator permissions for ${name}? `,
      }),
      removeFromGroup: (name?: string) => ({
        title: `Remove From Group?`,
        body: `Are you sure you want to remove ${name} from the group? This can not be undone.`,
      }),
    },
    topic: {
      makeModerator: (name?: string) => ({
        title: `Make Moderator?`,
        body: `Are you sure you want to make ${name} a topic moderator? They will be able to schedule video calls, manage topic members, and edit the topic.`,
      }),
      removeModerator: (name?: string) => ({
        title: `Remove Moderator Role?`,
        body: `Are you sure you want to remove moderator permissions for ${name}? `,
      }),
      removeFromGroup: (name?: string) => ({
        title: `Remove From Topic?`,
        body: `Are you sure you want to remove ${name} from the topic? This can not be undone.`,
      }),
    },
  },
};

export const dateTimeConverter = (date: string) => {
  return dayjs(date).format("MMM D, YYYY h:mm a");
};

export const copyToClipBoard = (text: string) => {
  let copied = false;
  try {
    navigator.clipboard.writeText(text);
    copied = true;
  } catch (err) {
    console.log("copy error", err);
  }
  return copied;
};
