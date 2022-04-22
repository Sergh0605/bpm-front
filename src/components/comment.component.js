import React from 'react';

class Comment extends React.Component {

    render() {
        return (
            <div className="ms-4">
                <div className="row w-100">
                    <div className="row comment-header">
                        <div className="col-md-5 fw-bold text-start ps-0">
                            {this.props.userLogin}
                        </div>
                        <div className="col-md-7 fw-bold text-end pe-0">
                            {this.props.timestamp}
                        </div>
                    </div>
                    <div className="row ps-1 pe-1 comment-message mb-3">
                        {this.props.text}
                    </div>
                </div>
            </div>
        )
    }
}
export default Comment;