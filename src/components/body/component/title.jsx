import React from 'react';

const Title = ({
                   title = "",
                   children,
               }) => {
    return <React.Fragment>
        <div className="size30">{title}</div>
        {children}
    </React.Fragment>
}
export default Title;
