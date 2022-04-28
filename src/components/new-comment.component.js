import React from 'react';
import {Button, Form} from "react-bootstrap";
import {FormattedMessage} from "react-intl";

class NewCommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.state = {
            comment: {
                text: "",
            }
        }
    }

    componentDidMount() {
        this.setState({
            comment: {
                text: "",
            }
        })
    }

    onSubmitHandler() {
        if (this.state.comment.text) {
            this.props.onSubmit(this.state.comment).then(() => {
                    this.setState({
                        comment: {
                            text: "",
                        }
                    })
                }
            )
        }
    }

    onChangeHandler(field, e) {
        let fields = this.state.comment;
        fields[field] = e.target.value;
        this.setState({fields})
    }

    render() {
        return (
            <Form>
                <Form.Group className="mb-3"
                            controlId="commentText">
                    <Form.Label><FormattedMessage id="comment_new-comment"/></Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={this.onChangeHandler.bind(this, "text")} value={this.state.comment.text}/>
                </Form.Group>
                <div align="end">
                    <Button
                        variant="primary"
                        onClick={this.onSubmitHandler}>
                        <FormattedMessage id="comment_send"/>
                    </Button>
                </div>
            </Form>
        )
    }
}

export default NewCommentForm;