import { useState, useEffect, useCallback } from "react";
import { useChatContext } from "stream-chat-react";

import useAppStores from "../../stores/app-context";
import fullName from "../../utils/full-name";
import { IMember } from "../../@types/Conversation";
import useEffectOnce from "../../hooks/use-effect-once";

const useConversationHelper = () => {
  const { appStore } = useAppStores();
  const { channel } = useChatContext();

  const [channelMembers, setChannelMembers] = useState([]);
  const [allChannelMembers, setAllChannelMembers] = useState([]);
  const [channelMemberRefs, setChannelMemberRefs] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [isGroupChannel, setIsGroupChannel] = useState(false);
  const [isTopicChannel, setIsTopicChannel] = useState(false);
  const [memberFirstNames, setMemberFirstNames] = useState("");
  const [myMember, setMyMember] = useState(null);
  const [anotherMember, setAnotherMember] = useState(null);
  const [hasAnotherMemberAcceptedInvite, setHasAnotherMemberAcceptedInvite] =
    useState<boolean>(null);
  const [hasUserMemberAcceptedInvite, setHasUserMemberAcceptedInvite] =
    useState<boolean>(null);

  const computeData = useCallback(() => {
    const members = Object.values(channel?.state?.members);
    const groupChannel = members?.length > 2;
    const myMember = groupChannel
      ? null
      : members?.filter(
          (member) => member.user.id === appStore?.user?.user?.ref
        )[0];
    const anotherMember = groupChannel
      ? null
      : members?.filter(
          (member) => member.user.id !== appStore?.user?.user?.ref
        )[0];

    setChannelMembers(members);
    setChannelMemberRefs(members?.map((member) => member.user_id));

    setIsGroupChannel(groupChannel);

    setMemberFirstNames(
      members
        ?.map(
          (member) =>
            member?.user?.firstName || member?.user?.id.substring(0, 8)
        )
        ?.slice(0, 5)
        ?.join(", ")
    );

    setMyMember(myMember);
    setAnotherMember(anotherMember);

    setHasAnotherMemberAcceptedInvite(
      groupChannel
        ? null
        : !!anotherMember?.invite_accepted_at || anotherMember.role === "owner"
    );

    setHasUserMemberAcceptedInvite(
      groupChannel
        ? null
        : myMember.role === "owner" || !!myMember?.invite_accepted_at
    );

    setChannelName(channel?.data?.name || memberFirstNames);

    // TODO: Find better way to figure this out
    setIsTopicChannel(false);
  }, [
    appStore?.user?.user?.ref,
    channel?.data?.name,
    channel?.state?.members,
    memberFirstNames,
  ]);

  const getAllChannelMembers = useCallback(async () => {
    try {
      const allMembers: any = await channel?.queryMembers({});
      setAllChannelMembers(allMembers?.members);
    } catch (error) {
      console.log(error);
    }
  }, [channel]);

  useEffectOnce(() => {
    computeData();
    getAllChannelMembers();
  });

  channel.on("channel.updated", computeData);

  useEffect(() => {
    return () => {
      channel.off("channel.updated", computeData);
    };
  }, [channel, computeData]);

  const getMemberName = (member: IMember) => {
    if (member.user === undefined) {
      return fullName([
        member.firstName || member.id.substring(0, 8),
        member.lastName,
      ]);
    } else {
      return fullName([
        member.user.firstName || member.user.id.substring(0, 8),
        member.user.lastName,
      ]);
    }
  };

  const getUserMessages = () => {
    return channel?.state?.messages.filter(
      (message) => message.type !== "system"
    );
  };
  const channelCreatorRef: string = channel?.data?.created_by["id"];
  const channelRef: string = channel?.id;
  return {
    channelName,
    channelMembers,
    channelMemberRefs,
    isGroupChannel,
    myMember,
    anotherMember,
    hasAnotherMemberAcceptedInvite,
    hasUserMemberAcceptedInvite,
    isTopicChannel,
    getMemberName,
    getUserMessages,
    channelCreatorRef,
    channelRef,
    allChannelMembers,
  };
};

export default useConversationHelper;
