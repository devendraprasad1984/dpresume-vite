import React from 'react'
// import ReactDOM from "react-dom";
import CommentApp from "comments/CommentApp";
import {shallow} from 'enzyme'
import CommentBox from "comments/CommentBox";
import CommentList from "comments/CommentList";

let wrapper;
const commentBoxText = () => it('shows a comment box', () => {
    // const div = document.createElement('div')
    // ReactDOM.render(<CommentApp/>, div)
    // console.log(div.innerHTML)
    // expect(div.innerHTML).toContain('CommentBox')
    expect(wrapper.find(CommentBox)).toHaveLength(1)
    expect(wrapper.find(CommentBox).length).toEqual(1)
    // ReactDOM.unmountComponentAtNode(div)
})
const commentListTest = () => it('shows a comment list', () => {
    expect(wrapper.find(CommentList).length).toEqual(1)
})

describe('testing comment app', () => {
        beforeEach(() => {
            wrapper = shallow(<CommentApp/>)
        })
        commentBoxText()
        commentListTest()
    }
)
