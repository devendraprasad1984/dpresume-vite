import React from "react";
import {mount} from 'enzyme'
import CommentBox from "../comments/CommentBox";
import Root from "../root";

let wrapped;
//you must understand nitty gritty's of beforeEach/beforeAll, afterEach, afterAll
beforeAll(() => {
    wrapped = mount(<Root><CommentBox/></Root>)
})

afterAll(() => {
    wrapped.unmount()
    // console.log('component comment box is cleanedup')
})

it('has textarea and submit button', () => {
    expect(wrapped.find('textarea').length).toEqual(1)
    expect(wrapped.find('button').length).toBeGreaterThan(1)
})

describe('testing text input and submit handle', () => {
    const handleInput=()=>{
        const textarea = wrapped.find('textarea')
        const mockClickEvent = {target: {value: 'new values'}}
        textarea.simulate('change', mockClickEvent)
        wrapped.update() //forces component to update after simulate change and state change in component
    }
    beforeEach(handleInput)

    it('has a textarea user can type in it', () => {
        const txtArea = wrapped.find('textarea')
        expect(txtArea.prop('value')).toEqual('new values')
    })

    it('has a submit form button', () => {
        // const submitform = wrapped.find('form')
        const submitform=wrapped.find('#commentsSubmitForm')
        submitform.simulate('submit')
        wrapped.update()
        const txtArea = wrapped.find('textarea')
        expect(txtArea.prop('value')).toEqual('')
    })
})

