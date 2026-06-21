import React from 'react'
import DashboardLink from "@/app/dashboard/dashboardLink";

const links = [
    {href: "/dashboard", title: "Home"},
    {href: "/dashboard/customers", title: "Customers"},
    {href: "/dashboard/invoices", title: "Invoices"},
]

function DashboardRootLayout({
                                 children
                             }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <div className="flex flex-col p-6 border-r-2 md:h-screen">
                    {links.map((link) => {
                        return <DashboardLink key={link.href} link={link}/>
                    })}
                </div>
            </div>
            <div className="grow md:overflow-y-auto p-6">{children}</div>
        </div>
    )
}

export default DashboardRootLayout
