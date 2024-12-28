import SortDoubleArrowsIcon from "../../public/static/icons/SortDoubleArrows.svg";
import CaretUpIcon from "../../public/static/icons/CaretUp.svg";
import styles from "./DataTableSortIcon.module.scss";
import React, { useEffect, useState } from "react";

interface Props {
  active: boolean;
  direction: "asc" | "desc" | null;
  title: string;
  onClick: () => void;
  onResetSort: () => void;
}

const DataTableSortIcon = ({
  active,
  direction,
  title,
  onClick,
  onResetSort,
}: Props) => {
  // STATE
  const [clickCount, setClickCount] = useState<number>(0);

  // HOOKS
  useEffect(() => {
    if (!active) setClickCount(0);
  }, [active]);

  useEffect(() => {
    // clicking the sort icon 3 times will reset sort on that column for the table
    if (clickCount >= 3) {
      setClickCount(0);
      onResetSort();
    }
  }, [clickCount, onResetSort]);

  // METHODS
  const handleClick = () => {
    setClickCount((prevCount) => {
      return prevCount + 1;
    });
    onClick();
  };

  return (
    <div className={!active ? styles.inactive : styles.active}>
      <button type="button" onClick={handleClick}>
        <span className={active ? styles.activeTitle : styles.inactiveTitle}>
          {title}
        </span>
        {!active ? (
          <SortDoubleArrowsIcon />
        ) : (
          <>
            {direction === "asc" ? (
              <CaretUpIcon style={{ transform: "rotate(180deg)" }} />
            ) : (
              <CaretUpIcon />
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default React.memo(DataTableSortIcon);
