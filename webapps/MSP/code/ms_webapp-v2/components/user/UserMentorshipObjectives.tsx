import React from "react";
import {observer} from "mobx-react-lite";
import {IMSPshipObjective} from "ms-npm/profile-models/_/MSPship-objective.model";

import styles from "./UserMSPshipObjectives.module.scss";
import Target from "../../public/static/icons/Target.svg";
import Lightbulb from "../../public/static/icons/Lightbulb.svg";
import Award from "../../public/static/icons/Award.svg";
import Star from "../../public/static/icons/Star.svg";

interface Props {
    MSPshipObjectives: IMSPshipObjective;
}

const UserMSPshipObjectives = observer(({MSPshipObjectives}: Props) => {
    return (
        <div>
            <div className={styles.objective}>
                <div className={styles.objectiveTitleGroup}>
                    <Lightbulb width={24} height={24}/>
                    <h3 className="buttonText">I Can Provide</h3>
                </div>
                <ul className={styles.objectiveList}>
                    {MSPshipObjectives?.capabilitiesProvided?.tags?.map((item) => (
                        <li key={item.id} className={styles.objectiveItem}>
                            {item?.text}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.objective}>
                <div className={styles.objectiveTitleGroup}>
                    <Target width={24} height={24}/>
                    <h3 className="buttonText">MSPship Goals</h3>
                </div>
                <ul className={styles.objectiveList}>
                    {MSPshipObjectives?.MSPshipGoals?.tags?.map((item) => (
                        <li key={item.id} className={styles.objectiveItem}>
                            {item?.text}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.objective}>
                <div className={styles.objectiveTitleGroup}>
                    <Award width={24} height={24}/>
                    <h3 className="buttonText">Skills & Interest</h3>
                </div>
                <ul className={styles.objectiveList}>
                    {MSPshipObjectives?.skills?.tags?.map((item) => (
                        <li key={item.id} className={styles.objectiveItem}>
                            {item?.text}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.objective}>
                <div className={styles.objectiveTitleGroup}>
                    <Star width={24} height={24}/>
                    <h3 className="buttonText">Industry Experience</h3>
                </div>
                <ul className={styles.objectiveList}>
                    {MSPshipObjectives?.industryExperience?.tags?.map((item) => (
                        <li key={item.id} className={styles.objectiveItem}>
                            {item?.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});

export default UserMSPshipObjectives;
