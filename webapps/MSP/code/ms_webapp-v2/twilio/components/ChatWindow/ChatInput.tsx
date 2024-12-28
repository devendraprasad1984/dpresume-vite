import React, { useEffect, useRef, useState } from "react";
import { Conversation } from "@twilio/conversations";
import classNames from "classnames";
import TextareaAutosize from "react-textarea-autosize";

import PaperClip from "../../../public/static/icons/PaperClip.svg";
import { isMobile } from "../../utils";
import Send from "../../../public/static/icons/Send.svg";
import styles from "./ChatInput.module.scss";
import useToast from "../../../hooks/use-toast";

interface ChatInputProps {
  conversation: Conversation;
  isChatWindowOpen: boolean;
}

const ALLOWED_FILE_TYPES =
  "audio/*, image/*, text/*, video/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document .xslx, .ppt, .pdf, .key, .svg, .csv";

export default function ChatInput({
  conversation,
  isChatWindowOpen,
}: ChatInputProps) {
  const { showErrorMessage } = useToast();

  const [messageBody, setMessageBody] = useState("");
  const [isSendingFile, setIsSendingFile] = useState(false);
  const isValidMessage = /\S/.test(messageBody);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  useEffect(() => {
    if (isChatWindowOpen) {
      // When the chat window is opened, we will focus on the text input.
      // This is so the user doesn't have to click on it to begin typing a message.
      textInputRef.current?.focus();
    }
  }, [isChatWindowOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageBody(event.target.value);
  };

  // ensures pressing enter + shift creates a new line, so that enter on its own only sends the message:
  const handleReturnKeyPress = (event: React.KeyboardEvent) => {
    if (!isMobile && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(messageBody);
    }
  };

  const handleSendMessage = (message: string) => {
    if (isValidMessage) {
      conversation.sendMessage(message.trim());
      setMessageBody("");
    }
  };

  const handleSendFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("userfile", file);
      setIsSendingFile(true);
      conversation
        .sendMessage(formData)
        .catch((e) => {
          if (e.code === 413) {
            showErrorMessage({
              title: "File Error",
              message: "File size is too large. Maximum file size is 150MB.",
            });
          } else {
            showErrorMessage({
              title: "File Error",
              message:
                "There was a problem uploading the file. Please try again.",
            });
          }
        })
        .finally(() => {
          setIsSendingFile(false);
        });
    }
  };

  return (
    <div className={styles.chatInputContainer}>
      <div
        className={classNames(styles.textAreaContainer, {
          [styles.isTextareaFocused]: isTextareaFocused,
        })}
      >
        {/*
        Here we add the "isTextareaFocused" class when the user is focused on the TextareaAutosize component.
        This helps to ensure a consistent appearance across all browsers. Adding padding to the TextareaAutosize
        component does not work well in Firefox. See: https://github.com/twilio/twilio-video-app-react/issues/498
        */}
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          className={styles.textArea}
          aria-label="chat input"
          placeholder="Write a message..."
          onKeyPress={handleReturnKeyPress}
          onChange={handleChange}
          value={messageBody}
          ref={(input) => (textInputRef.current = input)}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
        />
      </div>

      <div>
        {/* Since the file input element is invisible, we can hardcode an empty string as its value.
        This allows users to upload the same file multiple times. */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleSendFile}
          value={""}
          accept={ALLOWED_FILE_TYPES}
        />
        <div className={styles.buttonContainer}>
          <div className={styles.fileButtonContainer}>
            <button
              type="button"
              className={styles.button}
              onClick={() => fileInputRef.current?.click()}
              disabled={isSendingFile}
            >
              <PaperClip />
            </button>

            {isSendingFile && (
              <div className={styles.fileButtonLoadingSpinner} />
            )}
          </div>

          <button
            type="button"
            className={styles.button}
            onClick={() => handleSendMessage(messageBody)}
            disabled={!isValidMessage}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}
