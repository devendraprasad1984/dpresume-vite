import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { IProfile } from "ms-npm/profile-models";

import styles from "./OrgFlyoutProfile.module.scss";
import useAdminStores from "../../stores/admin-context";
import PeopleConnections from "../user/PeopleConnections";
import ActiveLink from "../core/ActiveLink";
import { SocialLinks } from "../core/SocialLinks";
import ContainedLinkButton from "../buttons/ContainedLinkButton";
import OrgAvatar from "../core/OrgAvatar";
import getVideoID from "../../utils/get-youtube-video-id";

interface Props {
  peopleConnections: IProfile[];
}

const OrgFlyoutProfile = observer(({ peopleConnections }: Props) => {
  const { adminOrgStore } = useAdminStores();

  return (
    <div>
      <div className={styles.profileBanner}>
        <div className={styles.profileBannerImage} />
        <div className={styles.profileBannerAvatar}>
          <OrgAvatar
            size={"xl"}
            src={adminOrgStore?.org?.photo}
            alt="Logo"
            name={adminOrgStore?.org?.name}
          />
        </div>
      </div>

      <div className={styles.profileContent}>
        <h3 className="header">{adminOrgStore?.org?.name}</h3>
        <div>
          <span className={styles.industry}>Retail</span>
          <span className={styles.since}>
            &nbsp;&bull;&nbsp;Since {adminOrgStore?.org?.established}
          </span>
        </div>
        <div>{/* badge goes here  */}</div>
        <SocialLinks
          url={adminOrgStore?.org?.website}
          linkedIn={adminOrgStore?.org?.linkedIn}
          facebook={adminOrgStore?.org?.facebook}
          instagram={adminOrgStore?.org?.instagram}
          twitter={adminOrgStore?.org?.twitter}
        />
        <div className={styles.buttonContainer}>
          <ContainedLinkButton
            disabled={!adminOrgStore?.org?.id}
            href={
              adminOrgStore?.org?.companyId &&
              `/admin/orgs/${adminOrgStore?.org?.companyId}/info`
            }
          >
            View Company Details
          </ContainedLinkButton>
        </div>
        <div className={styles.bioContainer}>
          <h3 className={styles.bioTitle}>Who We Are</h3>
          {adminOrgStore?.org?.video && (
            <div className="responsiveIframeContainer">
              <iframe
                className={classNames("responsiveIframe", styles.iframe)}
                src={`https://www.youtube.com/embed/${getVideoID(
                  adminOrgStore?.org?.video
                )}`}
                allow="autoplay; fullscreen"
                title="Who we are video"
              />
            </div>
          )}
          <p className={styles.bio}>{adminOrgStore?.org?.bio}</p>
        </div>
        <hr className={styles.sectionSeparator} />
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>People</h2>
            <ActiveLink
              className={styles.seeAll}
              href={`/admin/orgs/${adminOrgStore?.org?.id}/people`}
            >
              See All
            </ActiveLink>
          </div>
          <PeopleConnections connections={peopleConnections} />
        </div>
      </div>
    </div>
  );
});

export default OrgFlyoutProfile;
