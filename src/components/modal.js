import React from 'react';
import {Button, Modal} from "react-bootstrap";
import {FormattedMessage} from "react-intl";

class DeleteModal extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    delete() {
        this.props.onAgree(this.props.projectId);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Body>
                    <FormattedMessage id="project-delete-modal_message"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary fw-bold" onClick={this.props.onHide}>
                        <FormattedMessage id="project-delete-modal_no"/>
                    </Button>
                    <Button variant="btn btn-outline-primary fw-bold" onClick={this.delete}>
                        <FormattedMessage id="project-delete-modal_yes"/>
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
export default DeleteModal;