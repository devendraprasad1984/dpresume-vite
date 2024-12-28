import React, { useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { ITag, ITagList } from "ms-npm/base-models";
import classNames from "classnames";

import styles from "./TagInput.module.scss";
import X from "../../public/static/icons/X.svg";
import Label from "./Label";
import InputError, { InputErrorType } from "./InputError";

interface Props {
  name: string;
  label: string;
  tags: ITagList["tags"];
  tagCategory?: string;
  placeholder?: string;
  isSaving?: boolean;
  onChange: (value: ITagList["tags"]) => Promise<void>;
  validator?: (value: ITagList["tags"]) => boolean;
  errorType?: InputErrorType;
}

const TagInput = observer(
  ({
    name,
    label,
    tags,
    tagCategory,
    placeholder,
    isSaving = false,
    onChange,
    validator,
    errorType,
  }: Props) => {
    const tagInput = useRef(null);
    const [newTagValue, setNewTagValue] = useState("");

    const handleAddBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement).innerText;
      if (value !== "") {
        triggerOnChange(value);
      }
    };

    const handleAddKeydown = (e: React.KeyboardEvent) => {
      const value = (e.target as HTMLInputElement).value;
      if (e.key === "Enter") {
        e.stopPropagation();
        e.preventDefault();

        if (
          value &&
          tags
            ?.map((tag) => tag?.text?.toLocaleLowerCase())
            ?.includes(value.toLocaleLowerCase())
        ) {
          setNewTagValue("");
        } else if (value !== "") {
          triggerOnChange(value);
        }
        return false;
      }
    };

    const triggerOnChange = async (value: string) => {
      if (!isSaving) {
        const newTags = [
          ...tags,
          {
            id: 0,
            status: "active",
            type: "User",
            category: tagCategory,
            text: value,
          } as ITag,
        ];

        setNewTagValue("");
        await onChange(newTags);
        tagInput?.current?.focus();
      }
    };

    const removeTag = async (tag: Partial<ITag>) => {
      const updateTags = tags?.filter((item) => item.id !== tag?.id);
      onChange(updateTags);
    };

    const isValid = validator && validator(tags);

    return (
      <Label label={label} htmlFor={name}>
        <div
          className={classNames(
            styles.fakeInput,
            isSaving && styles.fakeInputSaving
          )}
        >
          {tags?.map((tag) => {
            return (
              <span
                key={`${name}-tag-${tag.ref || tag.text}`}
                className={styles.tagPill}
              >
                {tag.text}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isSaving}
                >
                  <X width="11" height="11" />
                </button>
              </span>
            );
          })}
          <input
            ref={tagInput}
            type="text"
            id={name}
            placeholder={placeholder || "Add tag"}
            onBlur={handleAddBlur}
            onKeyDown={handleAddKeydown}
            className={styles.ghostInput}
            value={newTagValue}
            onChange={(e) => setNewTagValue(e.target.value)}
            autoComplete="off"
            disabled={isSaving}
          />
        </div>
        <InputError messageType={errorType} isActive={!isValid} />
      </Label>
    );
  }
);

export default TagInput;
