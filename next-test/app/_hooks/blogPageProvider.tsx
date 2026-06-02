"use client"
import React from 'react'

const BlogPageContext = React.createContext([{
    id: 1,
    name: "test",
    content: "test content"
}]);

const BlogPageProvider = (props: any) => {
    const value = props.value;
    return <BlogPageContext.Provider value={value}>
        {props.children}
    </BlogPageContext.Provider>
};

export const useBlogPageContext = (): any => {
    return React.useContext(BlogPageContext)
};

export default BlogPageProvider;