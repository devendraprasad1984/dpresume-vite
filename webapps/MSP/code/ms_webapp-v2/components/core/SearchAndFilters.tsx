import { useState, ReactNode } from "react";
import Search from "./Search";

import styles from "./SearchAndFilters.module.scss";
import FilterIcon from "../../public/static/icons/Filter.svg";
import classNames from "classnames";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import XButton from "../buttons/XButton";

interface Props {
  placeholder?: string;
  onSearchChange: (value: string) => void;
  onResetFiltersClick: (value: any) => void;
  onShowResultsClick: (value: any) => void;
  children: ReactNode;
}

const SearchAndFilters = ({
  placeholder = "Search",
  onSearchChange,
  onResetFiltersClick,
  onShowResultsClick,
  children,
}: Props) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <>
      <div className={styles.wrap}>
        <div>
          <Search placeholder={placeholder} onChange={onSearchChange} />
        </div>
        <button
          className={styles.filterButton}
          onClick={() => {
            setFiltersOpen(true);
          }}
        >
          <FilterIcon className={styles.filterIcon} />
          Filters
        </button>
      </div>
      <div
        className={classNames(styles.filterSlider, filtersOpen ? "open" : null)}
      >
        <div className={styles.filterHeader}>
          Filters
          <XButton
            className={styles.closeIcon}
            onClick={() => {
              setFiltersOpen(false);
            }}
          />
        </div>
        <div className={styles.filterWrap}>{children}</div>
        <div className={styles.filterButtons}>
          <OutlineButton onClick={onResetFiltersClick}>Reset All</OutlineButton>
          <ContainedButton onClick={onShowResultsClick}>
            Show # Results
          </ContainedButton>
        </div>
      </div>
    </>
  );
};

export default SearchAndFilters;
