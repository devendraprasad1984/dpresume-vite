import React from "react";
import {mount} from "enzyme";
import Root from '../root'
import moxios from 'moxios'
import urls from "../urls";
import App from "../App";

let wrapped;
beforeEach(() => {
    wrapped = mount(
        <Root><App/></Root>
    )
    moxios.install()
    //intercepting axios call to below url, and fooling axios that call has been made and response is returned
    //no actual network call is being made
    //is like a middleware
    moxios.stubRequest(urls.comments, {
        status: 200,
        response: [{name: 'comment 1'}, {name: 'comment 2'}, {name: 'comment 3'}]
    })
})
afterEach(() => {
    moxios.uninstall()
})


it('App level render - integration test - can fetch list of comments and display them', (done) => {
    const fetchCommentBtn = wrapped.find('.fetch-comments')
    fetchCommentBtn.simulate('click')
    moxios.wait(() => {
        wrapped.update()
        const lis = wrapped.find('li')
        expect(lis.length).toBeGreaterThan(1)
        done()//to tell JEST to mark test DONE here and not automatically which will be problem in case of settimeout
        wrapped.unmount()
    })

})