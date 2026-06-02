const generateBlogs = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const blogs = await response.json()
    return blogs;
}
const generateBlogById = async (id: Number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const blog = await response.json()
    return blog;
}

const blogs = {
    generateBlogs,
    generateBlogById
};
export default blogs;