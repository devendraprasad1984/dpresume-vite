import React from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { IEducationHistory, IWorkHistory } from "ms-npm/profile-models";

import styles from "./UserEducationExperience.module.scss";
import Briefcase from "../../public/static/icons/Briefcase.svg";
import School from "../../public/static/icons/School.svg";

interface Props {
  educationHistory: IEducationHistory[];
  workHistory: IWorkHistory[];
}

const UserEducationExperience = observer(
  ({ educationHistory, workHistory }: Props) => {
    const formatDate = (date: string) => {
      if (!date) return;
      return dayjs(date).format("MMM YYYY");
    };

    return (
      <div className={styles.experience}>
        <ul className={styles.experienceList}>
          {workHistory?.map((item) => (
            <li key={item.id} className={styles.experienceItem}>
              <Briefcase width={24} height={24} />
              <div>
                {item?.title && (
                  <div className={styles.experienceTitle}>{item?.title}</div>
                )}
                {item?.company && (
                  <div className={styles.experienceCompany}>
                    {item?.company}
                  </div>
                )}
                <div className={styles.experienceDate}>
                  {[
                    formatDate(item?.startedOn as string),
                    item?.isCurrent
                      ? "Present"
                      : formatDate(item?.endedOn as string),
                  ].join(" - ")}
                </div>
              </div>
            </li>
          ))}
          {educationHistory?.map((item) => (
            <li key={item.id} className={styles.experienceItem}>
              <School width={24} height={24} />
              <div>
                {item?.school && (
                  <div className={styles.experienceTitle}>{item?.school}</div>
                )}
                {item?.degree && (
                  <div className={styles.experienceCompany}>{item?.degree}</div>
                )}
                <div className={styles.experienceDate}>
                  {[
                    formatDate(item?.startedOn as string),
                    item?.isCurrent
                      ? "Present"
                      : formatDate(item?.endedOn as string),
                  ].join(" - ")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default UserEducationExperience;
