import { observer } from "mobx-react-lite";
import styles from "../org/OrgSocials.module.scss";
import LinkedInIcon from "../../public/static/LinkedIn.svg";
import FacebookIcon from "../../public/static/Facebook.svg";
import InstagramIcon from "../../public/static/Instagram.svg";
import TwitterIcon from "../../public/static/Twitter.svg";
import ExternalLink from "../nav/ExternalLink";

type Props = {
  url: string;
  linkedIn?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
};

export const SocialLinks = observer(
  ({ url, linkedIn, facebook, instagram, twitter }: Props) => {
    return (
      <div className={styles.container}>
        {url && (
          <ExternalLink className={styles.link} href={url}>
            {url}
          </ExternalLink>
        )}
        <div className={styles.socialButtons}>
          {linkedIn && (
            <ExternalLink className={styles.socialButton} href={linkedIn}>
              <LinkedInIcon width={18} height={18} />
            </ExternalLink>
          )}
          {facebook && (
            <ExternalLink className={styles.socialButton} href={facebook}>
              <FacebookIcon width={18} height={18} />
            </ExternalLink>
          )}
          {instagram && (
            <ExternalLink className={styles.socialButton} href={instagram}>
              <InstagramIcon width={18} height={18} />
            </ExternalLink>
          )}
          {twitter && (
            <ExternalLink className={styles.socialButton} href={twitter}>
              <TwitterIcon width={18} height={18} />
            </ExternalLink>
          )}
        </div>
      </div>
    );
  }
);
