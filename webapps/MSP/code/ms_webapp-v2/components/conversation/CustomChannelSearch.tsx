import React from "react";
import {
  ChannelOrUserResponse,
  SearchResultItemProps,
  isChannel,
} from "stream-chat-react";

const CustomDropdown = (props: any) => {
  const { results, focusedUser, selectResult, SearchResultItem } = props;

  const items: any[] = results.filter((x) => x.cid);
  const users: any[] = results.filter((x) => !x.cid);

  return (
    <div>
      <p>Channels</p>
      {!items?.length && <p>No Channels...</p>}
      {items?.map((result, index) => (
        <SearchResultItem
          focusedUser={focusedUser}
          index={index}
          key={index}
          result={result}
          selectResult={selectResult}
        />
      ))}
      <p>Users</p>
      {!users.length && <p>No Users...</p>}
      {users.map((result, index) => (
        <SearchResultItem
          focusedUser={focusedUser}
          index={index}
          key={index}
          result={result}
          selectResult={selectResult}
        />
      ))}
    </div>
  );
};

const CustomChannelResultItem = (props: SearchResultItemProps) => {
  const { focusedUser, index, selectResult } = props;
  const result: ChannelOrUserResponse = props.result;
  const focused = focusedUser === index;
  const className = focused ? "search-result-focused" : "search-result";

  if (isChannel(result)) {
    const channel: any = result;
    const members = channel?.data?.member_count;

    //TODO: refactor this one when broader search permissioning is resolved
    return (
      <div className={className} onClick={() => selectResult(result)}>
        <div>#</div>
        <p>
          {" "}
          {channel?.data?.name}, ({members} member{members === 1 ? "" : "s"})
        </p>
      </div>
    );
  } else {
    return (
      <div className={className} onClick={() => selectResult(result)}>
        {result?.id || result?.name}
      </div>
    );
  }
};

export const CustomChannelSearchResultsHeader = () => (
  <div className="channel-search-header">So many search results!</div>
);
export const CustomChannelSearchDropDown = (props: any) => (
  <CustomDropdown {...props} />
);
export const CustomChannelSearchResult = (props: any) => (
  <CustomChannelResultItem {...props} />
);
