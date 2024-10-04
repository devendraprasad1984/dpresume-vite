import React from "react";

const FooterLinks = ({
                       linksArray = []
                     }) => {
  return linksArray.map(links => {
    return <a className="hyperlink border-bottom pad5" href={links.url} target="_blank">
      {links.title}
    </a>;
  });
};
export default FooterLinks;
