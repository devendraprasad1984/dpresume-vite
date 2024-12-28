import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Channel, Chat, ChannelList } from "stream-chat-react";
import { useRouter } from "next/router";

import withLogin from "../../components/core/WithLogin";
import UserLayout from "../../components/user/UserLayout";
import streamClient from "../../services/stream-client";
import useStreamLogic from "../../hooks/use-stream-logic";
import Search from "../../components/core/Search";
import styles from "./conversations.module.scss";
import useAppStores from "../../stores/app-context";
import { GiphyContextProvider } from "../../components/stream/contexts/GiphyContext";
import ConversationChannel from "../../components/conversation/ConversationChannel";

const Page = observer(() => {
  const { appStore } = useAppStores();
  const { connectStream } = useStreamLogic();
  const [clientReady, setClientReady] = useState(false);
  const [filters, setFilters] = useState(null);
  useState(false);
  const router = useRouter();
  const activeChannelRef = (router?.query?.channel as string) || "";

  const onSearch = (q: string) => {
    const customChannelFilterParams = {
      members: { $in: [appStore?.user?.user?.ref] },
    };
    if (q !== "") {
      customChannelFilterParams["name"] = { $autocomplete: `${q}` };
      //TODO: discuss with Elisha and see if its needed, as its not working as per doc
      // customChannelFilterParams["MEMBER.USER.NAME"] = { $autocomplete: `${q}` };
    }
    setFilters({ ...customChannelFilterParams });
  };

  useEffect(() => {
    const setupClient = async () => {
      try {
        await connectStream();
        setFilters({
          members: { $in: [appStore?.user?.user?.ref] },
        });
        setClientReady(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (appStore?.user?.user?.ref) {
      setupClient();
    }
  }, [connectStream, appStore]);

  const queryingChannels = useCallback(async () => {
    await streamClient.queryChannels(
      {
        members: { $in: [appStore?.user?.user?.ref] },
      },
      {},
      {
        watch: true,
        state: true,
        // TODO: Refactor if there is a better way to fetch just the channel count
        limit: 999,
      }
    );
  }, [appStore?.user?.user?.ref]);

  streamClient.on("channel.created", () => {
    if (clientReady) {
      queryingChannels();
    }
  });

  useEffect(() => {
    if (clientReady) {
      queryingChannels();
    }
  }, [clientReady, queryingChannels]);

  return (
    <UserLayout>
      <div className={styles.conversationContainer}>
        {clientReady && filters && (
          <GiphyContextProvider>
            <Chat client={streamClient}>
              <div className={styles.sidebar}>
                <div>
                  <div className={styles.searchSection}>
                    <Search onChange={onSearch} leftOffset={false} />
                  </div>
                  <div className={styles.pageTitleHeader}>
                    <h1 className="smallHeader">Conversations</h1>
                  </div>
                </div>
                <hr />
                <ChannelList
                  filters={filters}
                  showChannelSearch={false}
                  setActiveChannelOnMount={true}
                  customActiveChannel={activeChannelRef}
                  sendChannelsToList={false}
                />
              </div>
              <div>
                <Channel>
                  <ConversationChannel />
                </Channel>
              </div>
            </Chat>
          </GiphyContextProvider>
        )}
      </div>
    </UserLayout>
  );
});

export default withLogin(Page);
