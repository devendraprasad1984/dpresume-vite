"use client"

import {useBlogPageContext} from "@/app/_hooks/blogPageProvider";

const BlogInfoCSR = (props: any) => {
    const _this = useBlogPageContext();
    const blogById = _this.blogs.find((b: any) => Number(b.id) === Number(props.id)) || {}
    console.log("_this_BlogInfoCSR", _this.blogs, blogById)
    if (!blogById?.title) return <div>Not found</div>;
    return <section className="border-2">
        <div className="text-2xl text-blue-700">{blogById?.title}</div>
        <div><p dangerouslySetInnerHTML={{__html: blogById?.body as string | TrustedHTML}}/></div>
    </section>;
}

export default BlogInfoCSR
