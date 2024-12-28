import React, { SyntheticEvent, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { get } from "lodash";

import styles from "./DataTable.module.scss";
import DataTableCell from "./DataTableCell";
import MoreActions from "../core/MoreActions";
import DataTableSortIcon from "./DataTableSortIcon";
import { IMoreAction } from "../core/MoreActions";

export enum SORT_DIRECTIONS {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

interface ColSortKey {
  key: string;
  direction: SORT_DIRECTIONS.ASCENDING | SORT_DIRECTIONS.DESCENDING;
}

interface Props {
  dataSet: any[];
  columns: {
    key: string;
    name: string;
    sortable: boolean;
    columnSize: string;
    type?: "uiChip" | "capitalize" | "date" | "dateTime" | "count";
  }[];
  actions?: IMoreAction[];
  keyName: string;
  onRowClick?: (row: any) => void;
  onSort?: (
    name: string,
    direction: SORT_DIRECTIONS.ASCENDING | SORT_DIRECTIONS.DESCENDING
  ) => void;
}

const DataTable = observer(
  ({ dataSet, keyName, columns, onRowClick, actions, onSort }: Props) => {
    const columnGridStyle = columns.flatMap((item) => item.columnSize);

    if (actions?.length > 0) {
      columnGridStyle.push("3rem");
    }

    // STATE
    const [sortedCol, setSortedCol] = useState<ColSortKey>(null);

    // METHODS
    const handleRowClick = (e: SyntheticEvent, data: any) => {
      e.preventDefault();
      e.stopPropagation();
      onRowClick && onRowClick(data);
    };

    const handleSort = (key) => {
      if (!sortedCol || key !== sortedCol.key) {
        setSortedCol({
          key: `${key}`,
          direction: SORT_DIRECTIONS.ASCENDING,
        });
      } else {
        if (sortedCol.direction === SORT_DIRECTIONS.ASCENDING)
          setSortedCol((prevCol) => {
            return { ...prevCol, direction: SORT_DIRECTIONS.DESCENDING };
          });
        else {
          setSortedCol((prevCol) => {
            return { ...prevCol, direction: SORT_DIRECTIONS.ASCENDING };
          });
        }
      }
    };

    const resetSort = () => {
      setSortedCol(null);
      onSort && onSort(null, null);
    };

    // HOOKS
    useMemo(() => {
      if (sortedCol && onSort) onSort(sortedCol.key, sortedCol.direction);
    }, [sortedCol, onSort]);

    return (
      <div className={styles.table}>
        <div
          className={styles.tableHeaderRow}
          style={{
            gridTemplateColumns: columnGridStyle.join(" "),
          }}
        >
          {columns?.map((column) => (
            <div key={column.key} className={styles.tableHeaderCell}>
              {column.sortable ? (
                <DataTableSortIcon
                  title={column.name}
                  active={sortedCol ? sortedCol.key === column.key : false}
                  direction={sortedCol ? sortedCol.direction : null}
                  onClick={() => handleSort(`${column.key}`)}
                  onResetSort={resetSort}
                />
              ) : (
                <div>{column.name}</div>
              )}
            </div>
          ))}
        </div>
        {dataSet?.map((data) => (
          <div
            key={data[keyName]}
            role={onRowClick && "button"}
            className={styles.tableRow}
            style={{
              gridTemplateColumns: columnGridStyle.join(" "),
              cursor: onRowClick ? "pointer" : "default",
            }}
            onClick={(e) => handleRowClick(e, data)}
          >
            {columns?.map((column) => (
              <div key={column.key} className={styles.tableCell}>
                <DataTableCell type={column.type}>
                  {get(data, column.key)}
                </DataTableCell>
              </div>
            ))}
            {actions && (
              <div className={styles.tableCell}>
                <MoreActions
                  data={data}
                  id={`data-table-action-${data.id}`}
                  actions={actions}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

export default DataTable;
