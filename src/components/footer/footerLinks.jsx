import React from "react";

const FooterLinks = ({
                       linksArray = []
                     }) => {
  return linksArray.map((links, index) => {
    return <a key={`footer-link-${index}`} className="hyperlink border-bottom pad5" href={links.url} target="_blank">
      {links.title}
    </a>;
  });
};
export default FooterLinks;
