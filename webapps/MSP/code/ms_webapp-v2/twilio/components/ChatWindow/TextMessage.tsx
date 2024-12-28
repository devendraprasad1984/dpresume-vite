import React from "react";
import linkify from "linkify-it";
import classNames from "classnames";

import styles from "./TextMessage.module.scss";
import ExternalLink from "../../../components/nav/ExternalLink";

interface TextMessageProps {
  body: string;
  isLocalParticipant: boolean;
}

function addLinks(text: string) {
  const matches = linkify().match(text);
  if (!matches) return text;

  const results = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    results.push(text.slice(lastIndex, match.index));
    results.push(
      <ExternalLink href={match.url} key={i}>
        {match.text}
      </ExternalLink>
    );
    lastIndex = match.lastIndex;
  });

  results.push(text.slice(lastIndex, text.length));

  return results;
}

const TextMessage = ({ body, isLocalParticipant }: TextMessageProps) => {
  return (
    <div>
      <div
        className={classNames(styles.messageContainer, {
          [styles.isLocalParticipant]: isLocalParticipant,
        })}
      >
        <div>{addLinks(body)}</div>
      </div>
    </div>
  );
};

export default TextMessage;
