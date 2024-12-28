import React, { useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { SwiperSlide } from "swiper/react";
import { ICompanySearch } from "ms-npm/search-models/_/company-search.model";

import withLogin from "../../components/core/WithLogin";
import UserLayout from "../../components/user/UserLayout";
import CommunityContentWithNav from "../../components/community/CommunityContentWithNav";
import useToast from "../../hooks/use-toast";
import userService from "../../services/user-service";
import styles from "./community.module.scss";
import ActiveLink from "../../components/core/ActiveLink";
import { IPeopleSearchForUI } from "../../@types/Users";
import PersonCard from "../../components/community/PersonCard";
import Carousel from "../../components/core/Carousel";
import orgService from "../../services/org-service";
import OrgSimpleCard from "../../components/org/OrgSimpleCard";
import fullName from "../../utils/full-name";

const Page = observer(() => {
  const { showServerError } = useToast();
  const [people, setPeople] = useState<IPeopleSearchForUI[]>([]);
  const [orgs, setOrgs] = useState<ICompanySearch[]>([]);

  const getPeople = useCallback(async () => {
    try {
      const res = await userService.fetchUsers({
        filter: "peopleSearch",
        perPage: 4 * 5,
      });
      setPeople(
        res?.data?.result?.data?.map((item) => ({
          ...item,
          name: fullName([item.firstName, item.lastName]),
        }))
      );
    } catch (error) {
      showServerError(error);
    }
  }, [showServerError]);

  const getOrgs = useCallback(async () => {
    try {
      const res = await orgService.fetchOrgs({
        perPage: 6 * 5,
        filter: "explore",
        data: {},
      });
      setOrgs(res?.data?.result?.data);
    } catch (error) {
      showServerError(error);
    }
  }, [showServerError]);

  useEffect(() => {
    getPeople();
    getOrgs();
  }, [getPeople, getOrgs]);

  return (
    <UserLayout>
      <CommunityContentWithNav>
        <div>
          <div className={styles.sectionHeader}>
            <h2 className="smallHeader">People</h2>
            <ActiveLink href="/ms/community/people" className={styles.link}>
              See All
            </ActiveLink>
          </div>
          <div className={styles.people}>
            <Carousel
              slidesPerCard={{
                lg: 4,
                md: 3,
                sm: 2,
                xs: 1,
              }}
            >
              {people?.slice(0, 20)?.map((item) => (
                <SwiperSlide key={item?.ref}>
                  <PersonCard person={item} />
                </SwiperSlide>
              ))}
            </Carousel>
          </div>
        </div>
        <div>
          <div className={styles.sectionHeader}>
            <h2 className="smallHeader">Companies/Orgs</h2>
            <ActiveLink href="/ms/community/orgs" className={styles.link}>
              See All
            </ActiveLink>
          </div>
          <div className={styles.people}>
            <Carousel
              slidesPerCard={{
                lg: 6,
                md: 4,
                sm: 2,
                xs: 1,
              }}
            >
              {orgs?.slice(0, 30)?.map((item) => (
                <SwiperSlide key={item?.companyId}>
                  <OrgSimpleCard org={item} />
                </SwiperSlide>
              ))}
            </Carousel>
          </div>
        </div>
      </CommunityContentWithNav>
    </UserLayout>
  );
});

export default withLogin(Page);
