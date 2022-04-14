import assembledIcon from '../images/assembled.png';
import needToAssemble from '../images/needToAssemble.png';
import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import ProjectService from "../services/project.service";
import {wait} from "@testing-library/user-event/dist/utils";

class IconButton extends React.Component {
    constructor(props) {
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick(){
        this.props.onClickHandler(this.props.objectId)
    }

    render() {
        let disabled;
        if (this.props.disabled) {
            disabled = "disabled"
        } else {
            disabled = "";
        }
        return (
            <button type="button" className={"btn btn-outline-info " + disabled} onClick={this.buttonClick}>
                <img src={this.props.icon} alt="" width="40" height="40" />
            </button>
        )
    }
}

export default IconButton;