"use client"
import React from 'react'
import Link from "next/link";
import clsx from "clsx";
import {usePathname} from "next/navigation";

interface DashboardPropType {
    link: { href: string, title: string }
}

function DashboardLink(props: DashboardPropType) {
    const link = props.link;
    const pathName = usePathname();
    return <Link key={`id-${link.title}`} href={link.href}
                 className={clsx(
                     "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                     {"bg-sky-100 text-blue-600": pathName === link.href}
                 )}>{link.title}</Link>;
}

export default DashboardLink
