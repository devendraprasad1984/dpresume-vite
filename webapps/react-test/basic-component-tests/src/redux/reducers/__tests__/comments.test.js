import commentsReducer from "../comments";
import {SAVE_COMMENT} from "../../actions/types";

it('handles actions of type SAVE_COMMENT',()=>{
    const updatedComment=commentsReducer([],{type: SAVE_COMMENT, payload: ['test']})
    expect(updatedComment.length).toEqual(1)
    expect(updatedComment.join('')).toEqual('test')
})