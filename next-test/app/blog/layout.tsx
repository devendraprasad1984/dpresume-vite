import BlogsSubNav from "@/app/_components/blogsSubNav";
import BlogPageProvider from "@/app/_hooks/blogPageProvider";
import blogs from "@/app/_hooks/blogs";

const BlogLayout = async ({
                              children,
                          }: Readonly<{
    children: any;
}>) => {
    const blogsData = await blogs.generateBlogs();
    const stringifyBlogs = JSON.stringify(blogs);
    return (
        <section>
            <BlogsSubNav blogs={blogsData}/>
            <div id="blogs_info" data-blogs={stringifyBlogs}>
                <BlogPageProvider value={{blogs: blogsData}}>
                    {children}
                </BlogPageProvider>
            </div>
        </section>
    );
}
export default BlogLayout;