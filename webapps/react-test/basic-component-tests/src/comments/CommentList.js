import React from "react";
import {connect} from "react-redux";

const CommentList = (props) => {
    const {comments} = props
    const renderComments = () => {
        return comments.map(comment => {
            return <li key={comment}>{comment}</li>
        })
    }
    return (
        <div>
            <h3>comments list</h3>
            <ul>{renderComments()}</ul>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        comments: state.comments
    }
}
export default React.memo(connect(mapStateToProps, null)(CommentList))
