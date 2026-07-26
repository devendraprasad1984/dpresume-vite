import React from 'react';

const Title = ({
  title = "",
  children,
}) => {
  return <div>
    <div className="size30">{title}</div>
    {children}
  </div>;
};
export default Title;
