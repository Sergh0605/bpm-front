import assembledIcon from '../images/assembled.png';
import needToAssemble from '../images/needToAssemble.png';
import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import ProjectService from "../services/project.service";
import {wait} from "@testing-library/user-event/dist/utils";
import IconButton from "./icon-button.component";

class AssembleButton extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    render() {
        let image;
        let localDisabled = false
        if (this.props.assembled) {
            image = assembledIcon;
        } else {
            image = needToAssemble;
        }
        if (this.props.disabled || this.props.assembled) {
            localDisabled = true
        }
        return (
            <IconButton objectId={this.props.objectId} disabled={localDisabled} icon={image} onClickHandler={this.props.onClickHandler}>
            </IconButton>
        )
    }
}

export default AssembleButton;