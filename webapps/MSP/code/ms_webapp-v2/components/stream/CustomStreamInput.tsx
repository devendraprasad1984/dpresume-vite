import React, { useCallback, useEffect, useState } from "react";
import { ImageDropzone } from "react-file-utils";
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useMessageInputContext,
  useChannelStateContext,
} from "stream-chat-react";

import { useGiphyContext } from "./contexts/GiphyContext";
import ContainedButton from "../buttons/ContainedButton";
import IconButton from "../buttons/IconButton";
import MoreActions from "../core/MoreActions";

const CustomStreamInput = () => {
  const {
    closeCommandsList,
    cooldownRemaining,
    emojiPickerRef,
    handleChange,
    handleSubmit,
    numberOfUploads,
    openEmojiPicker,
    text,
    uploadNewFiles,
    isUploadEnabled,
    parent,
    setText,
    textareaRef,
  } = useMessageInputContext();

  const { acceptedFiles, maxNumberOfFiles, multipleUploads } =
    useChannelStateContext();

  const { giphyState, setGiphyState } = useGiphyContext();

  const [commandsOpen, setCommandsOpen] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      closeCommandsList();
      setCommandsOpen(false);
    };

    if (commandsOpen) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [commandsOpen]); // eslint-disable-line

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === "deleteContentBackward";

      if (text?.length === 1 && deletePressed) {
        setGiphyState(false);
      }

      if (!giphyState && text?.startsWith("/giphy") && !numberOfUploads) {
        setGiphyState(true);
      }

      handleChange(event);
    },
    [text, giphyState, numberOfUploads] // eslint-disable-line
  );

  const onGiphyAction = () => {
    setText("/giphy ");
    textareaRef?.current?.focus();
  };

  const onUploadAction = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      const files = Array.from(input.files);
      uploadNewFiles(files);
    };
    input.click();
  };

  return (
    <>
      {isUploadEnabled && <UploadsPreview />}
      <div className="input-ui">
        <div className="input-ui-icons">
          <EmojiPicker />
          <IconButton
            forwardRef={emojiPickerRef}
            size={28}
            iconSize={16}
            icon="smileyFace"
            label="Emoji"
            kind="primary"
            onClick={!cooldownRemaining ? openEmojiPicker : () => null}
            disabled={Boolean(cooldownRemaining)}
          />
          <MoreActions
            id="input-actions"
            actions={[
              {
                key: "gif",
                icon: "film",
                name: "Add GIF",
                onClick: onGiphyAction,
              },
              {
                key: "file",
                icon: "file",
                name: "Upload File",
                onClick: onUploadAction,
              },
            ]}
            Button={
              <IconButton
                size={28}
                iconSize={16}
                icon="plus"
                label="More Actions"
              />
            }
          />
        </div>
        <ImageDropzone
          accept={acceptedFiles}
          handleFiles={uploadNewFiles}
          multiple={multipleUploads}
          disabled={
            (maxNumberOfFiles !== undefined &&
              numberOfUploads >= maxNumberOfFiles) || // eslint-disable-line
            giphyState
          }
        >
          <div className={`input-ui-input`}>
            <div className="input-ui-input-textarea">
              <ChatAutoComplete
                onChange={onChange}
                placeholder="Type Something..."
              />
            </div>
          </div>
        </ImageDropzone>
        <div
          className={`input-ui-send ${text || numberOfUploads ? "text" : ""}`}
        >
          {parent && (
            <IconButton
              size={40}
              iconSize={18}
              label="Send"
              icon="send"
              kind="filled"
              onClick={handleSubmit}
            />
          )}
          {!parent && (
            <ContainedButton icon="send" onClick={handleSubmit}>
              Send
            </ContainedButton>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomStreamInput;
