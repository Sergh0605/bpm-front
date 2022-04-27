import React from 'react';
import {Offcanvas} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import CommentService from "../services/comment.service";
import InfiniteScroll from "react-infinite-scroll-component";
import Comment from "./comment.component";
import NewCommentForm from "./new-comment.component";

class CommentSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.getNextPage = this.getNextPage.bind(this);
        this.newComment = this.newComment.bind(this);
        this.state = {
            comments: [],
            isLastPage: false,
            currentPage: -1,
        }
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        if (this.props.projectId) {
            if (this.props.documentId) {
                CommentService.getByDocumentIdPage(this.props.projectId, this.props.documentId, 0, 10).then(
                    response => {
                        this.setState({
                            comments: response.data.content,
                            isLastPage: response.data.last,
                            currentPage: response.data.number,
                        })
                    }
                )
            } else {
                CommentService.getByProjectIdPage(this.props.projectId, 0, 10).then(
                    response => {
                        this.setState({
                            comments: response.data.content,
                            isLastPage: response.data.last,
                            currentPage: response.data.number,
                        })
                    })
            }
        }
    }

    getNextPage() {
        if (this.props.projectId) {
            if (this.props.documentId) {
                CommentService.getByDocumentIdPage(this.props.projectId, this.props.documentId, this.state.currentPage + 1, 5).then(
                    response => {
                        this.setState({
                            comments: this.state.comments.concat(response.data.content),
                            isLastPage: response.data.last,
                            currentPage: response.data.number,
                        })
                    }
                )
            } else {
                CommentService.getByProjectIdPage(this.props.projectId, this.state.currentPage + 1, 5).then(
                    response => {
                        this.setState({
                            comments: this.state.comments.concat(response.data.content),
                            isLastPage: response.data.last,
                            currentPage: response.data.number,
                        })
                    })
            }
        }
    }

    newComment(comment) {
        if (this.props.projectId) {
            if (this.props.documentId) {
                return CommentService.addCommentForDocument(this.props.projectId, this.props.documentId, comment).then(
                    () => {
                        this.refresh();
                    }
                )
            } else {
                return CommentService.addCommentForProject(this.props.projectId, comment).then(
                    () => {
                        this.refresh();
                    })
            }
        }
    }

    render() {
        return (
            <Offcanvas show={this.props.show} onHide={this.props.onHide}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <FormattedMessage id="comments-header"/>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="mb-5">
                        <NewCommentForm onSubmit={this.newComment}/>
                    </div>
                    <div>
                        <InfiniteScroll
                            next={this.getNextPage}
                            hasMore={!this.state.isLastPage}
                            loader={<div>Загрузка...</div>}
                            dataLength={this.state.comments.length}
                            height={550}
                        >
                            {this.state.comments.map((comment, index) => (
                                <div key={index}>
                                    <Comment
                                        userLogin={comment.user.name}
                                        timestamp={comment.publicationDateTime}
                                        text={comment.text}/>
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        )
    }
}

export default CommentSidebar;