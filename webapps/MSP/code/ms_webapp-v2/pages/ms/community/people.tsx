import React, { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";

import withLogin from "../../../components/core/WithLogin";
import UserLayout from "../../../components/user/UserLayout";
import CommunityContentWithNav from "../../../components/community/CommunityContentWithNav";
import useToast from "../../../hooks/use-toast";
import userService from "../../../services/user-service";
import PersonCard from "../../../components/community/PersonCard";
import styles from "./people.module.scss";
import { IPeopleSearchForUI } from "../../../@types/Users";
import fullName from "../../../utils/full-name";
import SearchAndFilters from "../../../components/core/SearchAndFilters";
import TagInput from "../../../components/form/TagInput";
import Select from "../../../components/form/Select";
import Label from "../../../components/form/Label";
import { LookingFor } from "ms-npm/profile-models";
import ForeverScroll from "../../../components/core/ForeverScroll";

const Page = observer(() => {
  const { showServerError } = useToast();
  const [people, setPeople] = useState<IPeopleSearchForUI[]>([]);

  const getPeople = useCallback(
    async (page: number = 1) => {
      try {
        const res = await userService.fetchUsers({
          filter: "peopleSearch",
          perPage: 12,
          page: page,
        });
        setPeople((p) => [
          ...p,
          ...res?.data?.result?.data?.map((item) => ({
            ...item,
            name: fullName([item?.firstName, item?.lastName]),
          })),
        ]);
        return res.data.result.currentPage >= res.data.result.lastPage;
      } catch (error) {
        showServerError(error);
        return false;
      }
    },
    [showServerError]
  );

  useEffect(() => {
    getPeople();
  }, [getPeople]);

  const tempChangeAction = async (input: any) => {
    console.log("tempChangeAction triggered", input);
  };

  return (
    <UserLayout>
      <CommunityContentWithNav>
        <SearchAndFilters
          onSearchChange={tempChangeAction}
          placeholder="Search People"
          onResetFiltersClick={tempChangeAction}
          onShowResultsClick={tempChangeAction}
        >
          <TagInput
            name="location"
            label="Location"
            tags={[]}
            placeholder="Add Filter"
            onChange={tempChangeAction}
          />
          <TagInput
            name="experince"
            label="Experience Level"
            tags={[]}
            placeholder="Add Filter"
            onChange={tempChangeAction}
          />
          <TagInput
            name="school"
            label="School"
            tags={[]}
            placeholder="Add Filter"
            onChange={tempChangeAction}
          />
          <TagInput
            name="company"
            label="Company/Organization"
            tags={[]}
            placeholder="Add Filter"
            onChange={tempChangeAction}
          />
          <TagInput
            name="industry"
            label="Industry"
            tags={[]}
            placeholder="Add Filter"
            onChange={tempChangeAction}
          />
          <Label label="Intent" htmlFor="intent">
            <Select id="intent" value={""} onChange={tempChangeAction}>
              <option value="" key="intent-option-any">
                Any
              </option>
              {Object.keys(LookingFor).map((key) => (
                <option value={key} key={`intent-option-${key}`}>
                  {LookingFor[key]}
                </option>
              ))}
            </Select>
          </Label>
        </SearchAndFilters>
        <ForeverScroll
          loadNext={getPeople}
          className={styles.people}
          loader={<div className={styles.message}>Loading more people...</div>}
          complete={
            <div className={styles.message}>And that&apos;s everyone.</div>
          }
        >
          {people?.map((item) => (
            <PersonCard key={item?.ref} person={item} />
          ))}
        </ForeverScroll>
      </CommunityContentWithNav>
    </UserLayout>
  );
});

export default withLogin(Page);
