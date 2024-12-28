import React, { ChangeEvent } from "react";
import { observer } from "mobx-react-lite";
import AutosizeInput from "react-input-autosize";

import styles from "./DataTablePagination.module.scss";
import Select from "../form/Select";
import ChevronLeft from "../../public/static/icons/ChevronLeft.svg";
import ChevronRight from "../../public/static/icons/ChevronRight.svg";

interface Props {
  currentPage: number;
  lastPage: number;
  perPage: number;
  onChangePerPage: (page: string) => void;
  onChangeCurrentPage: (page: string) => void;
  onSelectFirstPage: () => void;
  onSelectPreviousPage: () => void;
  onSelectNextPage: () => void;
  onSelectLastPage: () => void;
}

const DataTablePagination = observer(
  ({
    currentPage = 1,
    lastPage = 1,
    perPage = 50,
    onChangePerPage,
    onChangeCurrentPage,
    onSelectFirstPage,
    onSelectPreviousPage,
    onSelectNextPage,
    onSelectLastPage,
  }: Props) => {
    const handleCurrentPageChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChangeCurrentPage(e.target.value);
    };

    return (
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.perPageSelector}>
            <Select
              id="perPage"
              value={String(perPage)}
              onChange={onChangePerPage}
              inline={true}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
            <p className={styles.itemsPerPage}>items per page</p>
          </div>
          <div className={styles.pagingButtons}>
            <button
              type="button"
              className={styles.firstButton}
              disabled={currentPage === 1}
              onClick={onSelectFirstPage}
            >
              First
            </button>
            <button
              type="button"
              className={styles.previousButton}
              disabled={currentPage === 1}
              onClick={onSelectPreviousPage}
            >
              <ChevronLeft width={18} height={18} />
              <span className="visuallyHidden">Previous</span>
            </button>
            <AutosizeInput
              name="current-page-number"
              type="number"
              value={currentPage}
              onChange={handleCurrentPageChange}
              min={1}
              max={lastPage}
              className={styles.paginationInput}
            />
            <p className={styles.ofPage}>of {lastPage}</p>
            <button
              type="button"
              className={styles.nextButton}
              disabled={currentPage === lastPage}
              onClick={onSelectNextPage}
            >
              <ChevronRight width={18} height={18} />
              <span className="visuallyHidden">Next</span>
            </button>
            <button
              type="button"
              className={styles.lastButton}
              disabled={currentPage === lastPage}
              onClick={onSelectLastPage}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default DataTablePagination;
