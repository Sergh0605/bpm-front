import assembledIcon from '../images/assembled.png';
import needToAssemble from '../images/needToAssemble.png';
import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import ProjectService from "../services/project.service";
import {wait} from "@testing-library/user-event/dist/utils";

class LinkButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let disabled;
        if (this.props.disabled) {
            disabled = "disabled"
        } else {
            disabled = "";
        }

        return (
            <Link className={"btn btn-outline-info " + disabled} to={this.props.to}>
                <img src={this.props.icon} alt="" width="40" height="40"/>
            </Link>
        )
    }
}

export default LinkButton;