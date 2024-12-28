import {useState} from "react";
import {observer} from "mobx-react-lite";
import {IProfile} from "ms-npm/profile-models";
import {LookingFor} from "ms-npm/profile-models";
import {YearOfExperience} from "ms-npm/profile-models";

import userService from "../../services/user-service";
import useToast from "../../hooks/use-toast";
import styles from "./UserBasicProfileForm.module.scss";
import {SavingMessage} from "../core/SavingMessage";
import FormGroup from "../form/FromGroup";
import Label from "../form/Label";
import Select from "../form/Select";
import TagInput from "../form/TagInput";

interface Props {
    user: IProfile;
    onChangeSaving?: (isSaving: boolean) => void;
    onUserUpdate?: (user: IProfile) => void;
    onReFetchRequest: () => void;
}

const UserMSPshipObjectivesForm = observer(
    ({user, onChangeSaving, onUserUpdate, onReFetchRequest}: Props) => {
        const {showServerError} = useToast();
        const [isSaving, setIsSaving] = useState(null);
        const [MSPshipObjectives, setMSPshipObjectives] = useState(
            user.MSPshipObjectives
        );

        const updateMSPshipObjectives = async (key: string, value: any) => {
            const previousMSPshipObjectives = MSPshipObjectives;

            setIsSaving(true);
            onChangeSaving && onChangeSaving(true);

            setMSPshipObjectives({
                ...MSPshipObjectives,
                [key]: value,
            });

            try {
                const response = await userService.updateUserProfile(user?.id, {
                    MSPshipObjectives: {
                        [key]: value ? value : "",
                    },
                });
                setMSPshipObjectives(response.data.result.MSPshipObjectives);
                onUserUpdate(response.data.result);
            } catch (error) {
                onReFetchRequest();
                showServerError(error);
                setMSPshipObjectives(previousMSPshipObjectives);
            } finally {
                setIsSaving(false);
                onChangeSaving && onChangeSaving(false);
            }
        };

        return (
            <FormGroup>
                <div className={styles.headerGroup}>
                    <h2 className="header">MSPship Objectives</h2>
                    {!onChangeSaving && <SavingMessage isSaving={isSaving}/>}
                </div>
                <Label label="Looking for" htmlFor="lookingFor">
                    <Select
                        id="lookingFor"
                        value={MSPshipObjectives.lookingFor}
                        onChange={(value) =>
                            updateMSPshipObjectives("lookingFor", value)
                        }
                    >
                        {Object.keys(LookingFor).map((key) => {
                            return (
                                <option value={key} key={`looking-for-select-option-${key}`}>
                                    {LookingFor[key]}
                                </option>
                            );
                        })}
                    </Select>
                </Label>

                <TagInput
                    label="I Can Provide"
                    name="capabilitiesProvided"
                    tagCategory="CapabilitiesProvided"
                    tags={MSPshipObjectives.capabilitiesProvided?.tags || []}
                    isSaving={isSaving}
                    onChange={(value) =>
                        updateMSPshipObjectives("capabilitiesProvided", {tags: value})
                    }
                />

                <TagInput
                    label="MSPship Goals"
                    name="MSPshipGoals"
                    tagCategory="MSPshipGoals"
                    tags={MSPshipObjectives.MSPshipGoals?.tags || []}
                    isSaving={isSaving}
                    onChange={(value) =>
                        updateMSPshipObjectives("MSPshipGoals", {tags: value})
                    }
                />

                <TagInput
                    label="Industry Experience"
                    name="industryExperience"
                    tagCategory="IndustryExperience"
                    tags={MSPshipObjectives.industryExperience?.tags || []}
                    isSaving={isSaving}
                    onChange={(value) =>
                        updateMSPshipObjectives("industryExperience", {tags: value})
                    }
                />

                <Label label="Years of Experience" htmlFor="yearsExperience">
                    <Select
                        id="yearsExperience"
                        value={MSPshipObjectives.yearsExperience}
                        onChange={(value) =>
                            updateMSPshipObjectives("yearsExperience", value)
                        }
                        shorter={true}
                    >
                        {Object.keys(YearOfExperience)?.map((key) => (
                            <option
                                value={key}
                                key={`years-of-experience-select-option-${key}`}
                            >
                                {YearOfExperience[key]}
                            </option>
                        ))}
                    </Select>
                </Label>

                <TagInput
                    label="Skills"
                    name="skills"
                    tagCategory="Skills"
                    tags={MSPshipObjectives.skills?.tags || []}
                    isSaving={isSaving}
                    onChange={(value) =>
                        updateMSPshipObjectives("skills", {tags: value})
                    }
                />

                <TagInput
                    label="Interests"
                    name="industryInterest"
                    tagCategory="IndustryInterest"
                    tags={MSPshipObjectives.industryInterest?.tags || []}
                    isSaving={isSaving}
                    onChange={(value) =>
                        updateMSPshipObjectives("industryInterest", {tags: value})
                    }
                />
            </FormGroup>
        );
    }
);

export default UserMSPshipObjectivesForm;
