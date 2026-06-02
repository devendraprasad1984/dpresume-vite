import Link from "next/link";

const BlogsSubNav = (props: any) => {
    const hoverClass = "text-white b underline"
    const blogs = props?.blogs ||[];
    return (
        <div className="flex flex-row flex-wrap gap-2 bg-gray-500 p-1">
            {blogs.map((blog: any) => {
                return <Link key={`blog-${blog?.id}`} href={`/blog/${blog?.id}`} className={`${hoverClass}`}>{blog?.id}</Link>
            })}
        </div>
    )
}

export default BlogsSubNav
