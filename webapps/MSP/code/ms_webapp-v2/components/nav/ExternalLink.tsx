import React, { ReactElement, ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
  href: string;
  className?: string;
}

const ExternalLink = ({
  href,
  title,
  children,
  className,
}: Props): ReactElement => {
  return (
    <a
      className={className}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={title}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
