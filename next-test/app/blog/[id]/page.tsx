import BlogInfoSSR from "@/app/blog/[id]/blogInfoSSR";
import BlogInfoCSR from "@/app/blog/[id]/blogInfoCSR";

const BlogPageById = async (props: any) => {
    const _params = await props.params;
    return (
        <div>
            <BlogInfoSSR id={_params.id}/>
            <BlogInfoCSR id={_params.id}/>
        </div>
    )
}

export default BlogPageById
