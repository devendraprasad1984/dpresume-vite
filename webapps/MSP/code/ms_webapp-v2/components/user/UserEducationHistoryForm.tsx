import React, { useEffect, useReducer, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
import { IProfile, IEducationHistory } from "ms-npm/profile-models";

import Label from "../form/Label";
import FormGroup from "../form/FromGroup";
import FormSubGroup from "../form/FormSubGroup";
import CheckBox from "../form/CheckBox";
import styles from "./UserEducationHistoryForm.module.scss";
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

const UserEducationHistoryForm = observer(
  ({ user, onChangeSaving, onReFetchRequest }: Props) => {
    const { showServerError } = useToast();

    const [isSaving, setIsSaving] = useState(null);
    const [dateValidationError, setDateValidationError] = useState("");

    const [educationHistory, educationHistoryDispatch] = useReducer(
      (state: IEducationHistory[], { type, payload }) => {
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
      const transformedEducationHistory = user?.educationHistory?.map(
        (history) => transformJsonToForm(history)
      );

      educationHistoryDispatch({
        type: "set",
        payload: transformedEducationHistory,
      });
    }, [user]);

    const transformJsonToForm = (history: IEducationHistory) => ({
      id: history.id,
      status: history.status,
      school: history.school,
      degree: history.degree,
      field: history.field,
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

    const updateEducationHistory = async ({
      id,
      key,
      value,
    }: {
      id: number;
      key: string;
      value: string | boolean;
    }) => {
      if (key === "school" && !value) return;

      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      try {
        await userService.updateEducationHistory(id, {
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

      educationHistoryDispatch({
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
        educationHistoryDispatch({
          type: "update",
          payload: { id, key: "endMonth", value: "" },
        });
        educationHistoryDispatch({
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
        educationHistoryDispatch({
          type: "update",
          payload: { id, key: "endMonth", value: currentMonthYear.format("M") },
        });
        educationHistoryDispatch({
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
        await userService.updateEducationHistory(id, body);
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

      educationHistoryDispatch({
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
      const history = educationHistory.find((item) => item?.id === id);

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
        await userService.updateEducationHistory(id, body);
      } catch (error) {
        onReFetchRequest();
        showServerError(error);
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const onAddEducationHistory = async () => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      try {
        const res = await userService.addEducationHistory({
          profileId: user?.user?.id,
          status: "active",
          school: "My school",
          degree: "",
          field: "",
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

        const educationHistory = res.data.result as IEducationHistory;

        educationHistoryDispatch({
          type: "add",
          payload: transformJsonToForm(educationHistory),
        });
      } catch (error) {
        showServerError(error);
        onReFetchRequest();
      } finally {
        setIsSaving(false);
        onChangeSaving && onChangeSaving(false);
      }
    };

    const onRemoveEducationHistory = async (id: number) => {
      setIsSaving(true);
      onChangeSaving && onChangeSaving(true);

      educationHistoryDispatch({
        type: "remove",
        payload: { id },
      });

      try {
        await userService.removeEducationHistory(id);
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
          <h2 className="header">Education History</h2>
          {!onChangeSaving && <SavingMessage isSaving={isSaving} />}
        </div>
        {educationHistory?.map((history, i) => (
          <FormSubGroup key={history.id}>
            <div className={styles.actionGroup}>
              <CheckBox
                id={`education-${i}-current`}
                isChecked={history.isCurrent}
                onChange={(isChecked) => {
                  updateIsCurrent({
                    id: history?.id,
                    value: isChecked,
                  });
                }}
              >
                Current School
              </CheckBox>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemoveEducationHistory(history?.id)}
              >
                Remove
              </button>
            </div>
            <Label label="School" htmlFor={`education-${i}-schoolName`}>
              <input
                id={`education-${i}-schoolName`}
                type="text"
                value={history.school}
                onChange={(e) =>
                  educationHistoryDispatch({
                    type: "update",
                    payload: {
                      key: "school",
                      value: e.target.value,
                      id: history?.id,
                    },
                  })
                }
                onBlur={() =>
                  updateEducationHistory({
                    id: history?.id,
                    key: "school",
                    value: history?.school,
                  })
                }
                aria-invalid={history?.school?.length < 1}
              />
              <InputError
                messageType={InputErrorType.Required}
                isActive={history?.school?.length < 1}
              />
            </Label>
            <Label label="Degree" htmlFor={`education-${i}-degree`}>
              <input
                id={`education-${i}-degree`}
                value={history.degree}
                onChange={(e) =>
                  educationHistoryDispatch({
                    type: "update",
                    payload: {
                      key: "degree",
                      value: e.target.value,
                      id: history?.id,
                    },
                  })
                }
                onBlur={() =>
                  updateEducationHistory({
                    id: history?.id,
                    key: "degree",
                    value: history.degree,
                  })
                }
              />
            </Label>
            <Label label="Field of Study" htmlFor={`education-${i}-field`}>
              <input
                id={`education-${i}-field`}
                value={history.field}
                onChange={(e) =>
                  educationHistoryDispatch({
                    type: "update",
                    payload: {
                      key: "field",
                      value: e.target.value,
                      id: history?.id,
                    },
                  })
                }
                onBlur={() =>
                  updateEducationHistory({
                    id: history?.id,
                    key: "field",
                    value: history.field,
                  })
                }
              />
            </Label>
            <div className={styles.monthYearGroup}>
              <Label label="Start Month" htmlFor={`education-${i}-startMonth`}>
                <Select
                  id={`education-${i}-start-month`}
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
              <Label label="Start Year" htmlFor={`education-${i}-startYear`}>
                <Select
                  id={`education-${i}-start-Year`}
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
              <Label label="End Month" htmlFor={`education-${i}-endMonth`}>
                <Select
                  disabled={history.isCurrent}
                  id={`education-${i}-end-month`}
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
              <Label label="End Year" htmlFor={`education-${i}-endYear`}>
                <Select
                  disabled={history.isCurrent}
                  id={`education-${i}-end-year`}
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
        <ContainedButton icon="plus" onClick={onAddEducationHistory}>
          Add Education
        </ContainedButton>
      </FormGroup>
    );
  }
);

export default UserEducationHistoryForm;
