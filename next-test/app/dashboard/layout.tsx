import React from 'react'
import Link from "next/link";

function DashboardRootLayout({
                                 children
                             }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <div className="flex flex-col p-6 border-r-2 md:h-screen">
                    <Link href="/dashboard">Home</Link>
                    <Link href="/dashboard/customers">Customers</Link>
                    <Link href="/dashboard/invoices">Invoices</Link>
                </div>
            </div>
            <div className="grow md:overflow-y-auto p-6">{children}</div>
        </div>
    )
}

export default DashboardRootLayout
