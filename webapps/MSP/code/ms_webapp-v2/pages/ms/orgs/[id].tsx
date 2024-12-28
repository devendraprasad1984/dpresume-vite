import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { IInfo } from "ms-npm/company-models";
import classNames from "classnames";

import withLogin from "../../../components/core/WithLogin";
import UserLayout from "../../../components/user/UserLayout";
import orgService from "../../../services/org-service";
import styles from "./id.module.scss";
import ContainedButton from "../../../components/buttons/ContainedButton";
import { SocialLinks } from "../../../components/core/SocialLinks";
import OrgAvatar from "../../../components/core/OrgAvatar";
import getVideoID from "../../../utils/get-youtube-video-id";
import concatName from "../../../utils/concat-name";

const Page = observer(() => {
  const router = useRouter();
  const { id } = router.query;
  const orgId = +id;

  const [isConnected, setIsConnected] = useState(false);

  const [orgInfo, setOrgInfo] = useState<IInfo>();

  const connect = async () => {
    setIsConnected(true);
    setIsConnected(false);
  };

  const fetchOrgInfo = useCallback(async () => {
    try {
      const res = await orgService.fetchOrgInfo(orgId);
      setOrgInfo(res?.data?.result?.[0]);
    } catch (error) {
      console.error(error);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrgInfo();
  }, [orgId, fetchOrgInfo]);

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="header">{orgInfo?.name}</div>
          <ContainedButton onClick={connect} disabled={isConnected}>
            Connect
          </ContainedButton>
        </div>
        <div className={styles.wrapper}>
          <div>
            <div className={styles.section}>
              <div className={styles.card}>
                <div className={styles.profileBanner}>
                  <div className={styles.profileBannerImage} />
                  <div className={styles.profileBannerAvatar}>
                    <OrgAvatar
                      size={"xxl"}
                      src={orgInfo?.photo}
                      alt="Logo"
                      name={orgInfo?.name}
                    />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h1 className={styles.intro}>{orgInfo?.name}</h1>
                  <div className={styles.category}>
                    <span className={styles.industry}>{orgInfo?.category}</span>
                    {orgInfo?.established && (
                      <span className={styles.since}>
                        &nbsp;&bull;&nbsp;Since {orgInfo?.established}
                      </span>
                    )}
                  </div>
                  <div className={styles.cityState}>
                    {concatName([orgInfo?.city, orgInfo?.state], ", ")}
                  </div>
                  <div className={styles.socialLinksSection}>
                    <SocialLinks
                      url={orgInfo?.website}
                      twitter={orgInfo?.twitter}
                      instagram={orgInfo?.instagram}
                      linkedIn={orgInfo?.linkedIn}
                      facebook={orgInfo?.facebook}
                    />
                  </div>

                  <div className={styles.bioContainer}>
                    <h3 className={styles.bioTitle}>Who We Are</h3>
                    {orgInfo?.video && (
                      <div className="responsiveIframeContainer">
                        <iframe
                          className={classNames(
                            "responsiveIframe",
                            styles.iframe
                          )}
                          src={`https://www.youtube.com/embed/${getVideoID(
                            orgInfo?.video
                          )}`}
                          allow="autoplay; fullscreen"
                          title="Who we are video"
                        />
                      </div>
                    )}
                    <p className={styles.bio}>{orgInfo?.bio}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h2 className={styles.sectionTitle}>Recruiters</h2>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.section}>
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <h2 className={styles.sectionTitle}>Topics</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
});

export default withLogin(Page);
