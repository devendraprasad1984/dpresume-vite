import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import TruncateMarkup from "react-truncate-markup";

import styles from "./OverlayContainer.module.scss";
import OverlayContainer from "./OverlayContainer";
import Search from "../../core/Search";
import streamClient from "../../../services/stream-client";
import { useChannelActionContext, useChatContext } from "stream-chat-react";
import IconUtil from "../../core/IconsUtil";
import { dateTimeConverter } from "../utils";
import { IChatProps } from "../../../@types/Conversation";
import useConversationHelper from "../use-conversion-helper";

interface Props {
  onClose?: () => void;
  onChangeSearchInput: (val: string) => void;
}

const SearchChatOverlay = ({ onClose, onChangeSearchInput }: Props) => {
  const { channel } = useChatContext();
  const { getMemberName } = useConversationHelper();
  const { jumpToMessage } = useChannelActionContext();
  const [chatMessages, setChatMessages] = useState([]);
  const [searchText, setSearchText] = useState("");

  const searchMessages = useCallback(
    async (searchText) => {
      setSearchText(searchText);
      const messageFilters = { text: { $autocomplete: searchText } };

      try {
        const search = await streamClient.search(
          { cid: `${channel?.type || "team"}:${channel?.id}` },
          messageFilters,
          { limit: 200, offset: 0 }
        );
        const chatObject: IChatProps[] = search?.results?.map((chat: any) => {
          const { message } = chat;
          return {
            id: message.id,
            user: message.user,
            text: message.text,
            html: message.html,
            datetime: dateTimeConverter(message.updated_at.toString()),
          };
        });
        setChatMessages(chatObject);
        // console.log('stream client', streamClient)
      } catch (err) {
        console.error("error in search, contact admin");
      }
    },
    [channel?.id, channel?.type]
  );

  useEffect(() => {
    return () => {
      onChangeSearchInput("");
      setChatMessages([]);
    };
  }, [onChangeSearchInput]);

  const handleChatMessageJump = async (chat: IChatProps) => {
    try {
      await jumpToMessage(chat.id);
    } catch (err: any) {
      console.log("error jumping message", err);
    }
  };

  return (
    <OverlayContainer onClose={onClose} title={"Search"}>
      <div>
        <div className={styles.searchSection}>
          <Search onChange={searchMessages} leftOffset={true} />
        </div>
        {(chatMessages.length === 0 || searchText === "") && (
          <div className={styles.searchChatEmpty}>
            <span>
              <IconUtil icon={"searchChat"} height={100} width={100} />
            </span>
            <span>Search Conversations</span>
          </div>
        )}
        {chatMessages.length !== 0 && searchText !== "" && (
          <ul>
            {chatMessages?.map((chat) => (
              <li key={chat?.id}>
                <button
                  type="button"
                  className={styles.searchChatRow}
                  onClick={() => handleChatMessageJump(chat)}
                >
                  <p className={styles.searchMessageTime}>{chat?.datetime}</p>
                  <p className={styles.searchMessageName}>
                    {getMemberName(chat?.user)}
                  </p>
                  {chat?.text && (
                    <TruncateMarkup lines={5}>
                      <p className={styles.searchMessage}>{chat?.text}</p>
                    </TruncateMarkup>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OverlayContainer>
  );
};

export default observer(SearchChatOverlay);
