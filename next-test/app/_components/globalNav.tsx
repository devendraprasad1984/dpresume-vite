import Link from "next/link";

const GlobalNav = () => {
    const hoverClass = "hover:text-blue-400"
    return (
        <div className="flex flex-row gap-5 bg-amber-200 p-2">
            <Link href="/" className={`${hoverClass}`}>Home</Link>
            <Link href="/about" className={`${hoverClass}`}>About</Link>
            <Link href="/blog" className={`${hoverClass}`}>Blog</Link>
            <Link href="/checkout" className={`${hoverClass}`}>Checkout</Link>
            <Link href="/dashboard" className={`${hoverClass}`}>Dashboard</Link>
        </div>
    )
}

export default GlobalNav
