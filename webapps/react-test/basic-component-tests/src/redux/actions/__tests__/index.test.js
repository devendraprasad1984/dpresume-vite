import {saveComment} from "../index";
import {SAVE_COMMENT} from "../types";

describe('actions save comment test', () => {
    let action;
    beforeEach(() => {
        action = saveComment('test')
    })
    it('has correct comment type', () => {
        expect(action.type).toEqual(SAVE_COMMENT)
    })

    it('has correct payload', () => {
        expect(action.payload).toEqual('test')
    })
})