import assembledIcon from '../images/assembled.png';
import needToAssemble from '../images/needToAssemble.png';
import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import ProjectService from "../services/project.service";
import {wait} from "@testing-library/user-event/dist/utils";

class AssembleButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleAssemble = this.handleAssemble.bind(this);
        this.state = {projectId: props.projectId, documentId: props.documentId, assembled: props.assembled};
        console.log(this.state)
    }

    handleAssemble() {
        console.log(this.state)
        if (!this.state.assembled) {
            if (this.state.projectId) {
                ProjectService.assemble(this.state.projectId).then(this.props.refresh);
            } else if (this.state.documentId) {

            }
        }
    }

    render() {
        let image;
        let disabled;
        if (this.state.assembled) {
            image = assembledIcon;
            disabled = "disabled"
        } else {
            image = needToAssemble;
            disabled = "";
        }
        return (
            <button type="button" className={"btn btn-link " + disabled} onClick={this.handleAssemble}>
                <img src={image} alt="" width="40" height="40" />
            </button>
        )
    }
}

export default AssembleButton;