import {Checker, Regex} from "fnpm/validators";

import {ICompany, INote} from "ms-npm/admin-models";
import {State} from "ms-npm/base-models";
import {CompanyCategory} from "ms-npm/company-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 * Class with validation methods
 */
export abstract class Validator {
    /**
     * Validation of note body
     *
     * @param {INote} data note ui model
     * @param {boolean} isUpdate validate if is update or not
     * @returns {boolean} true / false
     */
    static isNoteDataValid(data: INote, isUpdate: boolean = false): boolean {
        //Validate Note table
        const noteUserIdValid = isUpdate && data.userId === undefined ? true : data.userId > 0;
        const noteStatusValid = isUpdate && data.status === undefined ? true : this.isStatusValid(data.status);
        const noteTextValid = isUpdate && data.text === undefined ? true : !Checker.isNullOrEmpty(data.text);

        //Return the result
        return noteUserIdValid && noteStatusValid && noteTextValid;
    }

    /**
     * Validation of ICompany Model
     *
     * @param {ICompany} data data of ICompany Model from UI
     * @param {boolean} isUpdate validate if is update or not
     * @returns {boolean} true / false
     */
    static isCompanyDataValid(data: Partial<ICompany>, isUpdate: boolean = false): boolean {
        //Validate Note table
        const isStatusValid =
            data.info.status === undefined
                ? true
                : Object.values(RecordStatus).includes(data.info.status as RecordStatus);
        const isBioValid = data.info.bio === undefined ? true : !Checker.isNullOrEmpty(data.info.bio);
        const isEstablished = data.info.established === undefined ? true : data.info.established > 0;
        const isValidAdminId = data.admin.userId === undefined ? false : data.admin.userId > 0;
        const isCategoryValid =
            data.info.category === undefined ? true : Object.values(CompanyCategory).includes(data.info.category);
        const isNameValid =
            isUpdate && data.info.name === undefined ? true : Checker.isStringValid(1, 60, data.info.name);
        const isCityValid = data.info.city === undefined ? true : Checker.isStringValid(1, 60, data.info.city);
        const isStateValid =
            data.info.state === undefined ? true : Object.values(State).includes(<State>data.info.state);
        const isFacebookValid =
            Checker.isNullOrEmpty(data.info.facebook) ||
            Checker.isMatch(Regex.socialMediaLink("facebook"), data.info.facebook);
        const isInstagramValid =
            Checker.isNullOrEmpty(data.info.instagram) ||
            Checker.isMatch(Regex.socialMediaLink("instagram"), data.info.instagram);
        const isLinkedInValid =
            Checker.isNullOrEmpty(data.info.linkedIn) ||
            Checker.isMatch(Regex.socialMediaLink("linkedin"), data.info.linkedIn);
        const isTwitterValid =
            Checker.isNullOrEmpty(data.info.twitter) ||
            Checker.isMatch(Regex.socialMediaLink("twitter"), data.info.twitter);
        const isWebsiteValid =
            Checker.isNullOrEmpty(data.info.website) || Checker.isMatch(Regex.url(), data.info.website);
        const isVideoValid = Checker.isStringValid(3, 100, data.info.video, false);
        const isPhotoValid = Checker.isStringValid(3, 100, data.info.photo, false);
        //Return the result
        return (
            isStatusValid &&
            isBioValid &&
            isEstablished &&
            isValidAdminId &&
            isCategoryValid &&
            isNameValid &&
            isFacebookValid &&
            isWebsiteValid &&
            isInstagramValid &&
            isLinkedInValid &&
            isTwitterValid &&
            isVideoValid &&
            isPhotoValid &&
            isStateValid &&
            isCityValid
        );
    }

    /**
     * Validate status of note and type
     *
     * @param {string} status status
     * @returns {boolean} true / false
     */
    private static isStatusValid(status: string) {
        //validate the property
        return Object.values(RecordStatus).includes(status as RecordStatus);
    }
}
