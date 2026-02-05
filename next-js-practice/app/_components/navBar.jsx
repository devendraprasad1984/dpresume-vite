import React from 'react';
import Link from "next/link";
import Logout from "@/app/_components/logoutButton";

const NavBar = () => {
  const session = true;
  return <nav className="bg-white shadow-sm">
    <div className="container mx-auto p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">Contact Manager</Link>
      <div className="flex items-center space-x-4">
        {session ? <React.Fragment>
          <Link href="/contacts" className="hover:text-blue-600 mr-8">Contacts</Link>
          <Logout/>
        </React.Fragment> : <React.Fragment>
          <Link href="/login" className="hover:text-blue-600 mr-8">Login</Link>
          <Link href="/register" className="hover:text-blue-600">Register</Link>
        </React.Fragment>}
      </div>
    </div>
  </nav>;
};
export default NavBar;