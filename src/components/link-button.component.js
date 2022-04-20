import React from 'react';
import {Link} from "react-router-dom";

class LinkButton extends React.Component {

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