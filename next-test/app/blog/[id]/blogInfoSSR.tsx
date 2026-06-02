import blogs from "@/app/_hooks/blogs";

const BlogInfoSSR = async (props: any) => {
    const blogById = await blogs.generateBlogById(props.id)
    if (!blogById) return <div>Not found</div>;
    return <section>
        <div>byApi: <p dangerouslySetInnerHTML={{__html: blogById?.body as string | TrustedHTML}}/></div>
    </section>;
}

export default BlogInfoSSR
