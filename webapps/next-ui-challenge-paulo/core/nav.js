import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import config from "../config";
import Link from "next/link";
import { useReactAppContext } from "../context/appContext";
import NavLink from "./navLink";

const btnNav = ["navBtn"].join(" ");

// const colorValue = { color: "#7936de" };
const activeClassName = "active";

const activeColor = (menuRef) => {
  const router = useRouter();
  let isHome = router.asPath === "/" && menuRef === "/";
  let match =
    menuRef !== "/" && router.pathname.indexOf(menuRef) !== -1 && !isHome;
  if (isHome) return activeClassName;
  return match ? activeClassName : "";
};

const Nav = () => {
  const { isMobile } = useReactAppContext();
  const [show, setShow] = useState(isMobile);

  const handleOpenCloseNav = () => {
    setShow(!show);
  };

  return (
    <Fragment>
      <div className={[`${show ? "hide" : "show"}`].join(" ")}>
        <div className={["pageNav", "column"].join(" ")}>
          <div className={"column"}>
            {config.menus.map((menu) => {
              return <NavLink name={menu.name} href={menu.href}/>
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Nav;
