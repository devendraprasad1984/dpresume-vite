import React, { SyntheticEvent, ReactNode, ReactElement } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

interface Props {
  id?: string;
  className?: string;
  activeStyle?: string;
  children?: ReactNode;
  onClickCallback?: () => void;
  href: string;
  as?: string;
  baseRoute?: string;
  disabled?: boolean;
}

const ActiveLink = ({
  id,
  className,
  activeStyle,
  children,
  onClickCallback,
  href,
  as,
  baseRoute,
  disabled,
}: Props): ReactElement => {
  // Determine dynamic custom route (/user/:id) vs static route (/login)
  const router = useRouter();
  const displayPathname = href;
  const routerPathname = router.asPath;
  const isActive = baseRoute
    ? routerPathname.includes(baseRoute)
    : routerPathname === displayPathname;

  const handleClick = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (as) {
      router.push(href, as).then(() => window.scrollTo(0, 0));
    } else if (href) {
      router.push(href).then(() => window.scrollTo(0, 0));
    }

    onClickCallback && onClickCallback();
  };

  return (
    <a
      id={id}
      href={displayPathname}
      className={classNames(className, isActive && activeStyle)}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      {children}
    </a>
  );
};

export default ActiveLink;
