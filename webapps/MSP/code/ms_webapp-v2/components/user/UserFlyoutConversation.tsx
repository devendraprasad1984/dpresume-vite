import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  StreamMessage,
} from "stream-chat-react";

import streamClient from "../../services/stream-client";
import useStreamLogic from "../../hooks/use-stream-logic";
import CustomStreamMessage from "../stream/CustomStreamMessage";
import useAppStores from "../../stores/app-context";
import useAdminStores from "../../stores/admin-context";
import styles from "./UserFlyoutConversation.module.scss";

const UserFlyoutConversation = observer(() => {
  const { appStore } = useAppStores();
  const { adminUserStore } = useAdminStores();

  const { connectStream } = useStreamLogic();
  const [clientReady, setClientReady] = useState(false);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupClient = async () => {
      await connectStream();

      const myRef = appStore?.user?.user?.ref;
      const selectedUserRef = adminUserStore?.user?.user?.ref;

      if (!selectedUserRef) return;

      const channels = await streamClient.queryChannels(
        {
          members: {
            $in: [myRef, selectedUserRef],
          },
        },
        [{ last_message_at: -1 }]
      );

      setChannel(channels[0]);
      setClientReady(true);
    };

    setupClient();
  }, [
    connectStream,
    adminUserStore?.user?.user?.ref,
    appStore?.user?.user?.ref,
  ]);

  const saveMessage = (
    message: StreamMessage,
    event: React.BaseSyntheticEvent
  ) => {
    console.log(message, event);
  };

  const customActions = { Save: saveMessage };

  return (
    <div className={styles.conversationContainer}>
      {clientReady && (
        <Chat client={streamClient}>
          <Channel channel={channel}>
            <MessageList
              Message={CustomStreamMessage}
              customMessageActions={customActions}
              messageActions={["react", "reply", "edit"]}
            />
            <MessageInput grow={true} />
            <Thread Message={CustomStreamMessage} />
          </Channel>
        </Chat>
      )}
    </div>
  );
});

export default UserFlyoutConversation;
