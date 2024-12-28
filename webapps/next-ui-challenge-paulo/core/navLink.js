import React from "react";
import Link from "next/link";

const NavLink = props => {
  const {name, href} = props
  return <>
    <Link
      prefetch={true}
      href={href}
      passHref
    >
    <button className={`bgnavy size12`}>
      {name}
    </button>
    </Link>
  </>
}

export default NavLink