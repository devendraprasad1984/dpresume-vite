import React from 'react';

const FooterLinks = ({
                         linksArray = []
                     }) => {
    return linksArray.map(links => {
        return <a className="hyperlink link-button" href={links.url} target="_blank">
            {links.title}
        </a>
    })
};
export default FooterLinks;
