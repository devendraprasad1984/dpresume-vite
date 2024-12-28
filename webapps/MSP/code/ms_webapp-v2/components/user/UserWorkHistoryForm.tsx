import React, { useEffect, useReducer, useState } from "react";
import { observer } from "mobx-react-lite";
import { IProfile } from "ms-npm/profile-models";
import { IWorkHistory } from "ms-npm/profile-models";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(customParseFormat);
dayjs.extend(utc);

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import FormSubGroup from "../form/FormSubGroup";
import CheckBox from "../form/CheckBox";
import styles from "./UserWorkHistoryForm.module.scss";
import Select from "../form/Select";
import calendarMonths from "../../utils/calendar-months";
import calendarYears from "../../utils/calendar-years";
import ContainedButton from "../buttons/ContainedButton";
import useToast from "../../hooks/use-toast";
import userService from "../../services/user-service";
import { SavingMessage } from "../core/SavingMessage";
import InputError, { InputErrorType } from "../form/InputError";
import {
  convertYearAndMonthToISO,
  validateDateRange,
} from "../../utils/date-helpers";

interface Props {
  user: IProfile;
  onChangeSaving?: (isSaving: boolean) => void;
  onReFetchRequest: () => void;
}

const UserWorkHistoryForm = observer(
  ({ user, onChangeSaving, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();

    const [isSaving, setIsSaving] = useState(null);
    const [dateValidationError, setDateValidationError] = useState("");

    const [workHistory, workHistoryDispatch] = useReducer(
      (state: IWorkHistory[], { type, payload }) => {
        switch (type) {
          case "set":
            return payload;
          case "add":
            return [...state, payload];
          case "update":
            return state.map((item) => {
              if (item?.id === payload?.id) {
                item[payload?.key] = payload?.value;
              }

              return item;
            });
          case "remove":
            return state.filter((item) => item?.id !== payload?.id);
          case "unset":
            return [];
          default:
            return state;
        }
      },
      []
    );

    useEffect(() => {
      const transformedWorkHistory = user?.workHistory?.map((history) =>
        transformJsonToForm(history)
      );

      workHistoryDispatch({
        type: "set",
        payload: transformedWorkHistory,
      });
    }, [user]);

    const transformJsonToForm = (history: IWorkHistory) => ({
      id: history.id,
      status: history.status,
      company: history.company,
      title: history.title,
      startMonth: history.startedOn
        ? dayjs(history.startedOn).utc().format("M")
        : "",
      startYear: history.startedOn
        ? dayjs(history.startedOn).utc().format("YYYY")
        : "",
      endMonth: history.endedOn ? dayjs(history.endedOn).utc().format("M") : "",
      endYear: history.endedOn
        ? dayjs(history.endedOn).utc().format("YYYY")
        : "",
      isCurrent: history.isCurrent,
    });

    const updateWorkHistory = async ({
      id,
      key,
      value,
    }: {
      id: number;
      key: string;
      value: string | boolean;
    }) => {
      if (key === "company" && !value) return;

      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      try {
        await userService.updateWorkHistory(id, {
          [key]: value,
        });
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const updateIsCurrent = async ({
      id,
      value,
    }: {
      id: number;
      value: boolean;
    }) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      workHistoryDispatch({
        type: "update",
        payload: {
          key: "isCurrent",
          value,
          id,
        },
      });

      const body: {
        isCurrent: boolean;
        endedOn?: string;
      } = {
        isCurrent: value,
      };

      if (value === true) {
        workHistoryDispatch({
          type: "update",
          payload: { id, key: "endMonth", value: "" },
        });
        workHistoryDispatch({
          type: "update",
          payload: { id, key: "endYear", value: "" },
        });
        body.endedOn = null;
      } else {
        const currentMonthYear = dayjs()
          .utc()
          .date(1)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0);
        workHistoryDispatch({
          type: "update",
          payload: { id, key: "endMonth", value: currentMonthYear.format("M") },
        });
        workHistoryDispatch({
          type: "update",
          payload: {
            id,
            key: "endYear",
            value: currentMonthYear.format("YYYY"),
          },
        });
        body.endedOn = currentMonthYear.toISOString();
      }

      try {
        await userService.updateWorkHistory(id, body);
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const updateMonthYear = async ({
      id,
      key,
      value,
    }: {
      id: number;
      key: string;
      value: string;
    }) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      workHistoryDispatch({
        type: "update",
        payload: {
          key,
          value,
          id,
        },
      });

      const body: {
        startedOn?: string;
        endedOn?: string;
      } = {};
      const history = workHistory.find((item) => item?.id === id);

      const updatedHistory = {
        ...history,
        [key]: value,
      };

      const validityObj = validateDateRange(updatedHistory);

      if (!validityObj.isValid) {
        setDateValidationError(validityObj.errorMessage);
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
        return;
      } else {
        setDateValidationError("");
      }

      // previous edits to start or end dates may not be saved (if invalid date range)
      // so include both startedOn and endedOn whenever the range is valid
      if (key === "startMonth" || key === "startYear") {
        body.endedOn = convertYearAndMonthToISO(
          history?.endYear,
          history?.endMonth
        );
      } else if (key === "endMonth" || key === "endYear") {
        body.startedOn = convertYearAndMonthToISO(
          history?.startYear,
          history?.startMonth
        );
      }

      if (key === "startMonth") {
        body.startedOn = convertYearAndMonthToISO(history?.startYear, value);
      } else if (key === "startYear") {
        body.startedOn = convertYearAndMonthToISO(value, history?.startMonth);
      } else if (key === "endMonth") {
        body.endedOn = convertYearAndMonthToISO(history?.endYear, value);
      } else if (key === "endYear") {
        body.endedOn = convertYearAndMonthToISO(value, history?.endMonth);
      }

      try {
        await userService.updateWorkHistory(id, body);
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const onAddWorkHistory = async () => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      try {
        const res = await userService.addWorkHistory({
          profileId: user?.user?.id,
          status: "active",
          company: "My company",
          title: "",
          description: "",
          isCurrent: false,
          startedOn: dayjs()
            .utc()
            .date(1)
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0),
          endedOn: dayjs()
            .utc()
            .date(1)
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0),
        });

        const workHistory = res.data.result as IWorkHistory;

        workHistoryDispatch({
          type: "add",
          payload: transformJsonToForm(workHistory),
        });
      } catch (error) {
        showServerError(error);
        onReFetchRequest();
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const onRemoveWorkHistory = async (id: number) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      workHistoryDispatch({
        type: "remove",
        payload: { id },
      });

      try {
        await userService.removeWorkHistory(id);
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    return (
      <FormGroup>
        <div className={styles.headerGroup}>
          <h2 className="header">Work History</h2>
          {!onChangeSaving && <SavingMessage isSaving={isSaving} />}
        </div>
        {workHistory?.map((history, i) => (
          <FormSubGroup key={history.id}>
            <div className={styles.actionGroup}>
              <CheckBox
                id={`company-${i}-current`}
                isChecked={history.isCurrent}
                onChange={(isChecked) => {
                  updateIsCurrent({
                    id: history?.id,
                    value: isChecked,
                  });
                }}
              >
                Current Role
              </CheckBox>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemoveWorkHistory(history?.id)}
              >
                Remove
              </button>
            </div>
            <Label label="Company" htmlFor={`company-${i}-companyName`}>
              <input
                id={`company-${i}-companyName`}
                type="text"
                value={history.company}
                onChange={(e) =>
                  workHistoryDispatch({
                    type: "update",
                    payload: {
                      key: "company",
                      value: e.target.value,
                      id: history?.id,
                    },
                  })
                }
                onBlur={() =>
                  updateWorkHistory({
                    id: history?.id,
                    key: "company",
                    value: history?.company,
                  })
                }
                aria-invalid={history?.company?.length < 1}
              />
              <InputError
                messageType={InputErrorType.Required}
                isActive={history?.company?.length < 1}
              />
            </Label>
            <Label label="Title" htmlFor={`company-${i}-companyTitle`}>
              <input
                id={`company-${i}-companyTitle`}
                value={history.title}
                onChange={(e) =>
                  workHistoryDispatch({
                    type: "update",
                    payload: {
                      key: "title",
                      value: e.target.value,
                      id: history?.id,
                    },
                  })
                }
                onBlur={() =>
                  updateWorkHistory({
                    id: history?.id,
                    key: "title",
                    value: history.title,
                  })
                }
              />
            </Label>
            <div className={styles.monthYearGroup}>
              <Label label="Start Month" htmlFor={`company-${i}-startMonth`}>
                <Select
                  id={`company-${i}-start-month`}
                  value={history.startMonth}
                  onChange={(month) => {
                    updateMonthYear({
                      id: history?.id,
                      key: "startMonth",
                      value: month,
                    });
                  }}
                >
                  {calendarMonths.map((month) => (
                    <option key={month.key} value={month.key}>
                      {month.value}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label label="Start Year" htmlFor={`company-${i}-startYear`}>
                <Select
                  id={`company-${i}-start-Year`}
                  value={history.startYear}
                  onChange={(year) => {
                    updateMonthYear({
                      id: history?.id,
                      key: "startYear",
                      value: year,
                    });
                  }}
                >
                  {calendarYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>
            <div className={styles.monthYearGroup}>
              <Label label="End Month" htmlFor={`company-${i}-endMonth`}>
                <Select
                  disabled={history.isCurrent}
                  id={`company-${i}-end-month`}
                  value={history.endMonth}
                  onChange={(month) => {
                    updateMonthYear({
                      id: history?.id,
                      key: "endMonth",
                      value: month,
                    });
                  }}
                >
                  {calendarMonths.map((month) => (
                    <option key={month.key} value={month.key}>
                      {month.value}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label label="End Year" htmlFor={`company-${i}-endYear`}>
                <Select
                  disabled={history.isCurrent}
                  id={`company-${i}-end-year`}
                  value={history.endYear}
                  onChange={(year) => {
                    updateMonthYear({
                      id: history?.id,
                      key: "endYear",
                      value: year,
                    });
                  }}
                >
                  {calendarYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>
            <InputError
              messageType={InputErrorType.Custom}
              isActive={!!dateValidationError}
            >
              {dateValidationError}
            </InputError>
          </FormSubGroup>
        ))}
        <ContainedButton icon="plus" onClick={onAddWorkHistory}>
          Add Work
        </ContainedButton>
      </FormGroup>
    );
  }
);

export default UserWorkHistoryForm;
