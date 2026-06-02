import React from 'react'

const AboutSubNavPage = async (props: any) => {
    const params = await props.params;
    const subPageId = params.subNav;
    return (
        <div>This is about us page - SUBNAV - {subPageId}</div>
    )
}

export default AboutSubNavPage
