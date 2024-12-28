import React, {useState} from "react";
import {connect} from "react-redux";
import * as actions from '../redux/actions'
import RequireAuth from "../hoc/requireAuth";

//styled components
const textBoxAreaStyles = {
    width: '90vw',
    height: '250px',
    fontSize: '25px'
}
const submitBtn = {
    fontSize: '25px',
    fontWeight: 'bolder',
    backgroundColor: 'blueviolet',
    color: 'white'

}
const fetchBtn = {
    fontSize: '25px',
    fontWeight: 'bolder',
    backgroundColor: 'mediumseagreen',
    color: 'white'

}
const CommentBox = (props) => {
    const {saveComment, fetchComments} = props
    const [comment, setComment] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        saveComment(comment)
        setComment('')
    }
    return (
        <div>
            <form id='commentsSubmitForm' onSubmit={handleSubmit}>
                <h4>Add Comment</h4>
                <textarea style={textBoxAreaStyles} value={comment} onChange={e => setComment(e.target.value)}/>
                <div>{comment.length} characters</div>
                <div>
                    <button style={submitBtn}>Submit</button>
                </div>
            </form>
            <button className='fetch-comments' style={fetchBtn} onClick={fetchComments}>Fetch Comments from API</button>
        </div>
    )
}

export default React.memo(connect(null, actions)(RequireAuth(CommentBox)))
