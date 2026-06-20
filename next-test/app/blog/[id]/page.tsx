import BlogInfoSSR from "@/app/blog/[id]/blogInfoSSR";
import BlogInfoCSR from "@/app/blog/[id]/blogInfoCSR";

interface ListProps {
    params: {
        id?: string
    };
}

const BlogPageById = async (props: ListProps) => {
    const _params = await props.params;
    return (
        <div>
            <BlogInfoSSR id={_params.id}/>
            <BlogInfoCSR id={_params.id}/>
        </div>
    )
}

export default BlogPageById
