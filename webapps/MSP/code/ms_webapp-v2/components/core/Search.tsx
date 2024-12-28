import React, { useCallback, useState, ChangeEvent } from "react";
import debounce from "lodash/debounce";
import classNames from "classnames";

import styles from "./Search.module.scss";
import Magnifier from "../../public/static/icons/Magnifier.svg";
import X from "../../public/static/icons/X.svg";

interface Props {
  placeholder?: string;
  debounceBy?: number; // in ms
  leftOffset?: boolean; // Helps visually align with vertically adjacent UI elements
  onChange: (value: string) => void;
  className?: string;
  onFocus?: (value: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (value: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (value: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Search = ({
  placeholder = "Search",
  onChange,
  debounceBy = 250,
  leftOffset = false,
  className = "",
  onFocus,
  onBlur,
  onKeyDown,
}: Props) => {
  const [q, setQ] = useState("");

  const debouncedSearch = debounce(onChange, debounceBy, {
    leading: false,
    trailing: true,
  });

  const searchThrottle = useCallback(debouncedSearch, [debouncedSearch]);

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;

    setQ(value);
    searchThrottle(value);
  };

  const onClear = () => {
    setQ("");
    onChange("");
  };

  return (
    <div
      className={classNames(
        styles.container,
        leftOffset && styles.leftOffset,
        className
      )}
    >
      <Magnifier className={styles.magnifier} width={15} height={15} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        onChange={handleTyping}
        onFocus={onFocus && onFocus}
        onBlur={onBlur && onBlur}
        onKeyDown={onKeyDown && onKeyDown}
        value={q}
      />
      {q && (
        <button type="button" onClick={onClear} className={styles.clearButton}>
          <X className={styles.x} width={22} height={22} />
        </button>
      )}
    </div>
  );
};

export default Search;
