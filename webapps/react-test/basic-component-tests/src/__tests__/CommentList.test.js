import React from "react";
import {mount} from 'enzyme'
import Root from "../root";
import CommentList from "../comments/CommentList";

let wrapped;
const initState = {
    comments: ['comment1', 'comment2']
}
beforeAll(() => {
    wrapped = mount(<Root initStoreState={initState}><CommentList/></Root>)
})

afterAll(() => {
    wrapped.unmount()
})

it('has same number of LI as list of comments', () => {
    const lis = wrapped.find('li')
    expect(lis.length).toEqual(initState.comments.length)
})

it('shows up all comments from store',()=>{
    const texts=wrapped.render().text()
    // console.log('found',texts, texts.indexOf(initState.comments.join('')))
    expect(texts.indexOf(initState.comments.join(''))).toBeGreaterThan(0)
    expect(texts).toContain(initState.comments.join(''))
})